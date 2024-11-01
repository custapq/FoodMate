import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

function getNutrientUnit(nutrientName) {
  const nutrientUnits = {
    energy: "kcal",
    water: "g",
    protein: "g",
    fat: "g",
    carbohydrate: "g",
    fiber: "g",
    ash: "g",
    calcium: "mg",
    phosphorus: "mg",
    magnesium: "mg",
    sodium: "mg",
    potassium: "mg",
    iron: "mg",
    copper: "mg",
    zinc: "mg",
    iodine: "ug",
    "beta-carotene": "ug",
    retinol: "ug",
    vitaminA: "ug",
    thiamin: "mg",
    riboflavin: "mg",
    niacin: "mg",
    vitaminC: "mg",
    vitaminE: "mg",
    sugar: "g",
  };
  return nutrientUnits[nutrientName] || "unknown";
}

export async function POST(req) {
  try {
    const foodItems = await req.json();
    const createdFoods = [];
    const nutrientsFromDB = await prisma.nutrient.findMany();

    for (const item of foodItems) {
      const { thaiName, englishName, imageURL, Nutrients, Foodtag } = item;
      const food = await prisma.food.create({
        data: {
          thaiName,
          englishName,
          imageURL,
          nutrientList: {
            create: await Promise.all(
              Object.keys(Nutrients)
                .filter((nutrientName) => Nutrients[nutrientName] !== 0)
                .map(async (nutrientName) => {
                  let nutrient = nutrientsFromDB.find(
                    (n) => n.name.toLowerCase() === nutrientName.toLowerCase()
                  );
                  if (!nutrient) {
                    nutrient = await prisma.nutrient.create({
                      data: { name: nutrientName },
                    });
                  }
                  return {
                    nutrientId: nutrient.id,
                    amount: Nutrients[nutrientName],
                    unit: getNutrientUnit(nutrientName),
                  };
                })
            ),
          },
          foodTagList: {
            create: await Promise.all(
              Foodtag.map(async (tag) => {
                let foodTag = await prisma.foodTag.findFirst({
                  where: { name: tag },
                });
                if (!foodTag) {
                  foodTag = await prisma.foodTag.create({
                    data: { name: tag },
                  });
                }
                return { tagId: foodTag.id };
              })
            ),
          },
        },
      });
      createdFoods.push(food);
    }
    return new Response(
      JSON.stringify({
        message: "Foods created successfully",
        foods: createdFoods,
      }),
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

export async function GET() {
  try {
    const foods = await prisma.food.findMany({
      include: {
        nutrientList: { include: { nutrient: true } },
        foodTagList: { include: { foodTag: true } },
      },
    });
    return new Response(JSON.stringify(foods), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Failed to get foods" }), {
      status: 500,
    });
  }
}
