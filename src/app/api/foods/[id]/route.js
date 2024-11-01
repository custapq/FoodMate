import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    // Log params for debugging
    console.log("Params received:", params);

    // Check if params.ids is defined
    if (!params.id) {
      return new Response(JSON.stringify({ error: "Food IDs are required" }), {
        status: 400,
      });
    }

    const foodIds = params.id.split(",").map((id) => parseInt(id, 10));
    const foods = await prisma.food.findMany({
      where: { id: { in: foodIds } },
      include: {
        nutrientList: { include: { nutrient: true } },
        foodTagList: { include: { foodTag: true } },
      },
    });

    if (!foods.length) {
      return new Response(JSON.stringify({ error: "No foods found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(foods), { status: 200 });
  } catch (error) {
    console.error("Error retrieving foods:", error);
    return new Response(
      JSON.stringify({ error: "Failed to get foods", details: error.message }),
      { status: 500 }
    );
  }
}
