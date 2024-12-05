/*
  Warnings:

  - Changed the type of `mobile_number` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "mobile_number",
ADD COLUMN     "mobile_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_number_key" ON "User"("mobile_number");
