/*
  Warnings:

  - Changed the type of `mobile_number` on the `Mentor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "mobile_number",
ADD COLUMN     "mobile_number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_mobile_number_key" ON "Mentor"("mobile_number");
