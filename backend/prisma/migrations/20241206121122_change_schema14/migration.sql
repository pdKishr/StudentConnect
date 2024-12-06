/*
  Warnings:

  - Made the column `startTime` on table `AvailableTime` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endTime` on table `AvailableTime` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AvailableTime" ALTER COLUMN "startTime" SET NOT NULL,
ALTER COLUMN "startTime" SET DATA TYPE TEXT,
ALTER COLUMN "endTime" SET NOT NULL,
ALTER COLUMN "endTime" SET DATA TYPE TEXT;
