import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name } = await request.json();
    const newCondition = await prisma.condition.create({
      data: { name },
    });
    return new Response(
      JSON.stringify({
        message: "Condition created successfully",
        newCondition,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating condition:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create condition" }),
      { status: 500 }
    );
  }
}
