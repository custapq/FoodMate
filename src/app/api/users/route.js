import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        conditionList: {
          include: {
            condition: true,
          },
        },
      },
    });

    if (users.length === 0) {
      return new Response(JSON.stringify({ error: "No users found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return new Response(JSON.stringify({ error: "Failed to get users" }), {
      status: 500,
    });
  }
}
