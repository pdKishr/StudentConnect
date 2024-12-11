/*
  Warnings:

  - You are about to drop the column `end` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `Availability` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Availability` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "end",
DROP COLUMN "start",
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
