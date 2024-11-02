import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const { userId, foodId } = await req.json();
    
    const favorite = await prisma.favoriteFood.create({
      data: {
        userId: parseInt(userId),
        foodId: parseInt(foodId)
      }
    });

    return new Response(JSON.stringify(favorite), { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return new Response(
        JSON.stringify({ error: "Food already in favorites" }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to add favorite" }),
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { userId, foodId } = await req.json();
    
    await prisma.favoriteFood.delete({
      where: {
        userId_foodId: {
          userId: parseInt(userId),
          foodId: parseInt(foodId)
        }
      }
    });

    return new Response(
      JSON.stringify({ message: "Favorite removed successfully" }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to remove favorite" }),
      { status: 500 }
    );
  }
} 