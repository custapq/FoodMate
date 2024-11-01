import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET() {
  try {
    const foodTags = await prisma.foodTag.findMany();
    return new Response(JSON.stringify(foodTags), { status: 200 });
  } catch (error) {
    console.error("Error retrieving food tags:", error);
    return new Response(JSON.stringify({ error: "Failed to get food tags." }), {
      status: 500,
    });
  }
}
