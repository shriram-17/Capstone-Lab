import prisma from "../../../../../lib/prismaclient";

export async function GET(request: Request, { params }: { params: { email: string } }) {
    try {
        const user = await prisma.user.findFirst(
            {
                where:{
                    email:params.email
                }
            }
        )
        console.log(user)
        return Response.json({user})
    } catch (error) {
        console.error("/api/user/[email] GET", error);
        return Response.json({ error: `Error fetching project for email: ${params.email}` })
    }
}