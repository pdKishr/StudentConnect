/*
  Warnings:

  - You are about to drop the column `endtime` on the `Purchase` table. All the data in the column will be lost.
  - Added the required column `endDate` to the `Purchase` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Purchase" DROP COLUMN "endtime",
ADD COLUMN     "endDate" TIMESTAMP(3) NOT NULL;
