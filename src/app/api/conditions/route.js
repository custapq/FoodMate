import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const conditions = await prisma.condition.findMany();
    return new Response(JSON.stringify(conditions), { status: 200 });
  } catch (error) {
    console.error("Error retrieving conditions:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get conditions." }),
      { status: 500 }
    );
  }
}
