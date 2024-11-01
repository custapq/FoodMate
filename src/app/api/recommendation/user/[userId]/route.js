import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const userId = parseInt(params.userId);

  try {
    const recommendations = await prisma.recommendation.findMany({
      where: { userId },
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
        JSON.stringify({ error: "No recommendations found for this user." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(recommendations), { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return new Response(
      JSON.stringify({ error: "An error occurred while fetching recommendations." }),
      { status: 500 }
    );
  }
}
