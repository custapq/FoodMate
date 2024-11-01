const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.nutrient.createMany({
    data: [
      { name: "energy" },
      { name: "water" },
      { name: "protein" },
      { name: "fat" },
      { name: "carbohydrate" },
      { name: "fiber" },
      { name: "ash" },
      { name: "calcium" },
      { name: "phosphorus" },
      { name: "magnesium" },
      { name: "sodium" },
      { name: "potassium" },
      { name: "iron" },
      { name: "copper" },
      { name: "zinc" },
      { name: "iodine" },
      { name: "beta-carotene" },
      { name: "retinol" },
      { name: "vitaminA" },
      { name: "thiamin" },
      { name: "riboflavin" },
      { name: "niacin" },
      { name: "vitaminC" },
      { name: "vitaminE" },
      { name: "sugar" },
    ],
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    console.log("seed nutrients complete");
    await prisma.$disconnect();
  });
