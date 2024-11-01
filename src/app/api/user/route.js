import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { age, weight, height, gender, goal, exercise, condition } =
      await request.json();

    const ageInt = parseInt(age, 10);
    const weightInt = parseInt(weight, 10);
    const heightInt = parseInt(height, 10);

    if (isNaN(ageInt) || isNaN(weightInt) || isNaN(heightInt)) {
      return new Response(
        JSON.stringify({ error: "Invalid age, weight, or height" }),
        { status: 400 }
      );
    }

    const newUser = await prisma.user.create({
      data: {
        age: ageInt,
        weight: weightInt,
        height: heightInt,
        gender,
        goal,
        exercise,
      },
    });

    if (condition && Array.isArray(condition)) {
      const conditionPromises = condition.map(async (conditionId) => {
        await prisma.conditionList.create({
          data: {
            userId: newUser.id,
            conditionId: parseInt(conditionId, 10),
          },
        });
      });

      await Promise.all(conditionPromises);
    }

    return new Response(JSON.stringify(newUser), { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return new Response(JSON.stringify({ error: "Failed to create user" }), {
      status: 500,
    });
  }
}

export async function PUT(request) {
  try {
    const { userId, age, weight, height, gender, goal, exercise, condition } =
      await request.json();

    // Validate input
    if (!userId) {
      return new Response(JSON.stringify({ error: "User ID is required" }), {
        status: 400,
      });
    }

    // Update user data
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        age: parseInt(age, 10),
        weight: parseInt(weight, 10),
        height: parseInt(height, 10),
        gender,
        goal,
        exercise,
      },
    });

    // Handle conditions similarly
    if (condition && Array.isArray(condition)) {
      await prisma.conditionList.deleteMany({ where: { userId: userId } });
      await Promise.all(
        condition.map(async (conditionId) => {
          await prisma.conditionList.create({
            data: { userId: userId, conditionId: parseInt(conditionId, 10) },
          });
        })
      );
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}
