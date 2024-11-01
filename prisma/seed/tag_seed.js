const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.foodTag.createMany({
    data: [
      { name: "อาหารจานหลัก" },
      { name: "กับข้าว" },
      { name: "อาหารเจ" },
      { name: "ของหวาน" },
      { name: "ของทอด" },
      { name: "ก๋วยเตี๊ยว" },
      { name: "แกง" },
      { name: "จิ้ม" },
      { name: "ต้ม" },
      { name: "ผัด" },
      { name: "ทอด" },
      { name: "อาหารภาคกลาง" },
      { name: "อาหารภาคใต้" },
      { name: "อาหารภาคเหนือ" },
      { name: "อาหารภาคอีสาน" },
    ],
  });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
