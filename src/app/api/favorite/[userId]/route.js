import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req, { params }) {
  try {
    const userId = parseInt(params.userId);
    
    const favorites = await prisma.favoriteFood.findMany({
      where: { userId },
      include: {
        food: {
          include: {
            nutrientList: { include: { nutrient: true } },
            foodTagList: { include: { foodTag: true } }
          }
        }
      }
    });

    return new Response(JSON.stringify(favorites), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to get favorites" }),
      { status: 500 }
    );
  }
} 