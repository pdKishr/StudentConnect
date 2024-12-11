/*
  Warnings:

  - Made the column `timezone` on table `Mentor` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Mentor" ALTER COLUMN "timezone" SET NOT NULL,
ALTER COLUMN "timezone" SET DEFAULT 'Asia/Kolkata';
