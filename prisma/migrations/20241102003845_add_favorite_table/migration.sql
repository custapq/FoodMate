-- CreateTable
CREATE TABLE "favoriteFood" (
    "userId" INTEGER NOT NULL,
    "foodId" INTEGER NOT NULL,

    CONSTRAINT "favoriteFood_pkey" PRIMARY KEY ("userId","foodId")
);

-- AddForeignKey
ALTER TABLE "favoriteFood" ADD CONSTRAINT "favoriteFood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favoriteFood" ADD CONSTRAINT "favoriteFood_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
