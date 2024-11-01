// /app/api/recommendation/[id]/route.js
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request, { params }) {
  const userId = parseInt(params.id);
  const { foodRecommendation = [], timestamp } = await request.json();

  if (foodRecommendation.length === 0) {
    return new Response(
      JSON.stringify({ error: "Recommendation must have at least one food." }),
      {
        status: 400,
      }
    );
  }

  try {
    const recommendation = await prisma.recommendation.create({
      data: {
        userId,
        foodRecommendation: {
          create: foodRecommendation.map((food, index) => ({
            sequence: index + 1,
            foodId: food,
          })),
        },
        timeStamp: timestamp ? new Date(timestamp) : new Date(),
      },
      include: {
        foodRecommendation: true,
      },
    });

    return new Response(JSON.stringify(recommendation), { status: 201 });
  } catch (error) {
    console.error("Error creating recommendation:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while creating the recommendation.",
      }),
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  const recommendationId = parseInt(params.id);

  try {
    const recommendation = await prisma.recommendation.findUnique({
      where: { id: recommendationId },
      include: {
        foodRecommendation: {
          include: {
            food: true,
          },
        },
      },
    });

    if (!recommendation) {
      return new Response(
        JSON.stringify({ error: "Recommendation not found." }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(recommendation), { status: 200 });
  } catch (error) {
    console.error("Error fetching recommendation:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while fetching the recommendation.",
      }),
      { status: 500 }
    );
  }
}
