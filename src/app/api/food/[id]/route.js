import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const foodId = parseInt(params.id);
    const food = await prisma.food.findUnique({
      where: { id: foodId },
      include: {
        nutrientList: { include: { nutrient: true } },
        foodTagList: { include: { foodTag: true } },
      },
    });

    if (!food) {
      return new Response(JSON.stringify({ error: "Food not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(food), { status: 200 });
  } catch (error) {
    console.error("Error retrieving food:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get food", details: error.message }),
      { status: 500 }
    );
  }
}
