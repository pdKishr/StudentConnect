/*
  Warnings:

  - The primary key for the `AvailableTime` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `startTime` column on the `AvailableTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `endTime` column on the `AvailableTime` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Made the column `startYear` on table `WorkExperience` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_mentorId_fkey";

-- AlterTable
ALTER TABLE "Admin" ADD COLUMN     "verifyBox" TEXT[];

-- AlterTable
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_pkey",
DROP COLUMN "startTime",
ADD COLUMN     "startTime" TIMESTAMP(3),
DROP COLUMN "endTime",
ADD COLUMN     "endTime" TIMESTAMP(3),
ADD CONSTRAINT "AvailableTime_pkey" PRIMARY KEY ("mentorId", "day");

-- AlterTable
ALTER TABLE "WorkExperience" ALTER COLUMN "startYear" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "AvailableTime" ADD CONSTRAINT "AvailableTime_id_fkey" FOREIGN KEY ("id") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
