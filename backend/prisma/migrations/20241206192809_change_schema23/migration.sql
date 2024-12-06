/*
  Warnings:

  - You are about to drop the column `endTime` on the `TrialBooking` table. All the data in the column will be lost.
  - Made the column `startYear` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endYear` on table `Education` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endYear` on table `WorkExperience` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Education" ALTER COLUMN "startYear" SET NOT NULL,
ALTER COLUMN "startYear" SET DATA TYPE TEXT,
ALTER COLUMN "endYear" SET NOT NULL,
ALTER COLUMN "endYear" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "TrialBooking" DROP COLUMN "endTime",
ALTER COLUMN "startTime" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "WorkExperience" ALTER COLUMN "startYear" SET DATA TYPE TEXT,
ALTER COLUMN "endYear" SET NOT NULL,
ALTER COLUMN "endYear" SET DATA TYPE TEXT;
