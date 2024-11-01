import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const userId = parseInt(params.userId);
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const recommendations = await prisma.recommendation.findMany({
      where: {
        userId,
        timeStamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        foodRecommendation: {
          include: {
            food: {
              include: {
                nutrientList: {
                  include: {
                    nutrient: true,
                  },
                },
                foodTagList: {
                  include: {
                    foodTag: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (recommendations.length === 0) {
      return new Response(
        JSON.stringify({ error: "No recommendations found for today." }),
        {
          status: 404,
        }
      );
    }

    return new Response(JSON.stringify(recommendations), { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching recommendations.",
      }),
      { status: 500 }
    );
  }
}
