const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.condition.createMany({
    data: [
      { name: "โรคความดันโลหิตสูง" },
      { name: "โรคหลอดเลือดสมอง" },
      { name: "โรคหัวใจขาดเลือด" },
      { name: "โรคกระเพาะอาหาร" },
      { name: "โรคมะเร็งตับ" },
      { name: "โรคเบาหวาน" },
      { name: "โรคถุงลมโป่งพอง" },
      { name: "โรคกระดูกพรุน" },
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
