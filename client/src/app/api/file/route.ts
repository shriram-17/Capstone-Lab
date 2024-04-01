import prisma from "../../../../lib/prismaclient"
import { FilePayload, UserPayload } from "../../../../lib/types";

export async function POST(request:Request) {
    const reqJson : FilePayload = await request.json()
    try {
        const user:UserPayload = {
            username:reqJson.username,
            email:reqJson.email,
            password:reqJson.password
        }
        const response = await prisma.sqlFile.create({
            data:{
                fileName : reqJson.filename,
                user:{
                    connect:{email:reqJson.email}
                }
            }
        })
        return Response.json({response})
    } catch (error : any) {
        return Response.json({"error":error},{status:400})
    }
    
}

