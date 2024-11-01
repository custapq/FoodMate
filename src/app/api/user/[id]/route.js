import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { id } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        conditionList: {
          include: {
            condition: true,
          },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Failed to get user" }), {
      status: 500,
    });
  }
}
export async function PUT(request, { params }) {
  const { id } = params;
  const { age, weight, height, gender, goal, exercise, condition } =
    await request.json();

  try {
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        age: age !== undefined ? parseInt(age, 10) : existingUser.age,
        weight:
          weight !== undefined ? parseInt(weight, 10) : existingUser.weight,
        height:
          height !== undefined ? parseInt(height, 10) : existingUser.height,
        gender: gender ?? existingUser.gender,
        goal: goal ?? existingUser.goal,
        exercise: exercise ?? existingUser.exercise,
      },
    });

    if (condition && Array.isArray(condition)) {
      await prisma.conditionList.deleteMany({
        where: { userId: parseInt(id) },
      });

      const conditionPromises = condition.map(async (conditionId) => {
        await prisma.conditionList.create({
          data: {
            userId: updatedUser.id,
            conditionId: parseInt(conditionId, 10),
          },
        });
      });
      await Promise.all(conditionPromises);
    }

    return new Response(JSON.stringify(updatedUser), { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return new Response(JSON.stringify({ error: "Failed to update user" }), {
      status: 500,
    });
  }
}
