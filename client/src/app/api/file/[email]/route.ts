import {User } from "@prisma/client";
import prisma from "../../../../../lib/prismaclient";

export async function GET(request: Request, { params }: { params: { email: string } }) {
    try {
        const user: User | null = await prisma.user.findFirst({
            where: {
                email: params.email
            },
            include:{sqlFiles :true}
        });
        return Response.json({ user });
    } catch (error) {
        console.error("/api/file/[email] GET", error);
        return Response.json({ error: `Error fetching project for email: ${params.email}` });
    }
}
