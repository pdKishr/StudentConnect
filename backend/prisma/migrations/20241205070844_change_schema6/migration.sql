/*
  Warnings:

  - You are about to drop the column `College` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `isComplete` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "College",
DROP COLUMN "isComplete",
DROP COLUMN "verified",
ADD COLUMN     "college" TEXT,
ADD COLUMN     "completePercentage" INTEGER NOT NULL DEFAULT 0;
