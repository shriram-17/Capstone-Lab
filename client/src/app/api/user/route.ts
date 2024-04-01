import { User } from "@prisma/client";
import prisma from "../../../../lib/prismaclient";

export async function POST(request:Request) {
   const reqBodyJSON = await request.json()
   try {
       const user : User = await prisma.user.create({
           data: {
               username: reqBodyJSON.username,
               email: reqBodyJSON.email,
               password: reqBodyJSON.password
           }
       })
       return Response.json({user},{status:200})
   }
   catch (error : any) {
       return Response.json({"error":error.message},{status:400})
   }
}

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        return Response.json({ users });
    } catch (error) {
        return Response.json({ error: "Error fetching users." }, { status: 500 });
    }
}
