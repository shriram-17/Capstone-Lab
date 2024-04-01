from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import psycopg2
import regex as re

load_dotenv()

DB_URL = os.getenv("DB_URL")

conn = psycopg2.connect(DB_URL)

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
    allow_credentials=True 
)

@app.post("/sql")
async def sql_parser(sql_file: UploadFile = File(...), email: str = Form(...)):
    try:
        contents = await sql_file.read()
        sql_queries = contents.decode().split(';')
        if not email:
            raise ValueError("Email parameter is empty")

        cursor = conn.cursor()

        cursor.execute("SELECT id FROM users WHERE email = %s;", (email,))
        existing_user = cursor.fetchone()
        if existing_user:
            user_id = existing_user[0]
        else:
            cursor.execute("INSERT INTO users (email) VALUES (%s) RETURNING id;", (email,))
            user_id = cursor.fetchone()[0]

        results = []
        for i, sql_query in enumerate(sql_queries):
            sql_query = sql_query.strip()
            if not sql_query:
                continue
            cursor.execute(sql_query)
            
            if sql_query.upper().startswith("SELECT"):
                result = cursor.fetchall()
                table_names = re.findall(r'FROM (\w+)', sql_query, re.IGNORECASE)
            else:
                result = "Query executed successfully"
                table_names = []
            results.append(result)

            if i == 0:
                cursor.execute("INSERT INTO queries (user_id, result, table_names) VALUES (%s, %s, %s) RETURNING id;", (user_id, str(result), ', '.join(table_names)))
                query_id = cursor.fetchone()[0]
            else:
                cursor.execute("UPDATE queries SET result = %s, table_names = %s WHERE id = %s;", (str(result), ', '.join(table_names), query_id))
            conn.commit()

        cursor.close()

        return {"success": True, "results": results}

    except psycopg2.Error as pe:
        conn.rollback()
        print("Psycopg2 Error:", pe)
        return {"Error": str(pe)}
    except Exception as e:
        print("Unexpected Error:", e)
        return {"Error": str(e)}


@app.get("/users")
async def get_users():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users;")
        print(cursor.fetchall())
        cursor.close()
        return {"users": "users"}
    except Exception as e:
        print(e)
        return {"Error": str(e)}


@app.get("/queries")
async def get_queries():
    try:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM queries;")
        print(cursor.fetchall())
        cursor.close()
        return {"queries":"dsdsd"}
    except Exception as e:
        print(e)
        return {"Error": str(e)}
    
@app.get("/tables")
async def get_tables(drop: bool = False):
    try:
        cursor = conn.cursor()
        # Query to retrieve all tables in the current database
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public'  -- Change 'public' to your schema name if different
            AND table_type = 'BASE TABLE';
        """)
        tables = cursor.fetchall()
        cursor.close()
        # Extract table names from the result
        table_names = [table[0] for table in tables]

        # If drop parameter is True, drop all tables
        if drop:
            cursor = conn.cursor()
            for table_name in table_names:
                try:
                    # Use double quotes to avoid conflicts with reserved keywords
                    drop_query = f"DROP TABLE IF EXISTS \"{table_name}\" CASCADE;"
                    cursor.execute(drop_query)
                    conn.commit()
                except Exception as e:
                    print(f"Error dropping table {table_name}: {e}")
                    # Rollback the transaction if an error occurs
                    conn.rollback()
            cursor.close()

        return {"tables": table_names}
    except Exception as e:
        print(e)
        return {"Error": str(e)}


