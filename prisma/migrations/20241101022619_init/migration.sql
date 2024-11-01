-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Goal" AS ENUM ('GENERAL', 'GAINWEIGHT', 'WEIGHTMAINTAIN', 'LOSSWEIGHT');

-- CreateEnum
CREATE TYPE "Exercise" AS ENUM ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'SPORTMAN');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "age" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "gender" "Gender" NOT NULL,
    "goal" "Goal" NOT NULL,
    "exercise" "Exercise" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conditionList" (
    "userId" INTEGER NOT NULL,
    "conditionId" INTEGER NOT NULL,

    CONSTRAINT "conditionList_pkey" PRIMARY KEY ("userId","conditionId")
);

-- CreateTable
CREATE TABLE "condition" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "condition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodRecommendation" (
    "recommendationId" INTEGER NOT NULL,
    "sequence" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "foodRecommendation_pkey" PRIMARY KEY ("recommendationId","sequence")
);

-- CreateTable
CREATE TABLE "food" (
    "id" SERIAL NOT NULL,
    "thaiName" TEXT NOT NULL,
    "englishName" TEXT NOT NULL,
    "imageURL" TEXT,

    CONSTRAINT "food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "foodTagList" (
    "foodId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "foodTagList_pkey" PRIMARY KEY ("foodId","tagId")
);

-- CreateTable
CREATE TABLE "foodTag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "foodTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "nutrientList" (
    "foodId" INTEGER NOT NULL,
    "nutrientId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,

    CONSTRAINT "nutrientList_pkey" PRIMARY KEY ("foodId","nutrientId")
);

-- CreateTable
CREATE TABLE "nutrient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "nutrient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "conditionList" ADD CONSTRAINT "conditionList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditionList" ADD CONSTRAINT "conditionList_conditionId_fkey" FOREIGN KEY ("conditionId") REFERENCES "condition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodRecommendation" ADD CONSTRAINT "foodRecommendation_recommendationId_fkey" FOREIGN KEY ("recommendationId") REFERENCES "recommendation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodRecommendation" ADD CONSTRAINT "foodRecommendation_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodTagList" ADD CONSTRAINT "foodTagList_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "foodTagList" ADD CONSTRAINT "foodTagList_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "foodTag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrientList" ADD CONSTRAINT "nutrientList_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "nutrientList" ADD CONSTRAINT "nutrientList_nutrientId_fkey" FOREIGN KEY ("nutrientId") REFERENCES "nutrient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
