from psycopg2 import Error
from dotenv import load_dotenv
import psycopg2
import os

load_dotenv()

DB_URL = os.getenv("DB_URL")
conn = psycopg2.connect(DB_URL)


def table_execute():
    try:
        cursor = conn.cursor()

        create_users_table_query = """
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL
            );
            """
        cursor = conn.cursor()
        cursor.execute(create_users_table_query)
        conn.commit()

        create_queries_table_query = """
            CREATE TABLE IF NOT EXISTS queries (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id),
                result TEXT,
                file_name TEXT,
                table_names TEXT
            );
            """
        cursor.execute(create_queries_table_query)
        conn.commit()

        cursor.close()
        conn.close()

        return "Tables executed successfully"

    except Error as e:
        print(e)
        return "Error: " + str(e)

table_execute()