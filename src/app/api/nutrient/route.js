import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const nutrients = await prisma.nutrient.findMany();
    return new Response(JSON.stringify(nutrients), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to get nutrients" }), {
      status: 500,
    });
  }
}

export async function POST(req) {
  try {
    const { name } = await req.json();
    const newNutrient = await prisma.nutrient.create({
      data: { name },
    });
    return new Response(
      JSON.stringify({ message: "Nutrient created successfully", newNutrient }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Failed to create nutrient" }),
      { status: 500 }
    );
  }
}
