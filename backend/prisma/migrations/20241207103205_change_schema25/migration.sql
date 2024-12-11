/*
  Warnings:

  - You are about to drop the `AvailableTime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `bookingStatus` on the `Booking` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "AvailableTime" DROP CONSTRAINT "AvailableTime_id_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "endTime" TEXT NOT NULL,
DROP COLUMN "bookingStatus",
ADD COLUMN     "bookingStatus" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "timezone" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "timezone" TEXT;

-- DropTable
DROP TABLE "AvailableTime";

-- DropEnum
DROP TYPE "status";

-- CreateTable
CREATE TABLE "Timing" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "availability" BOOLEAN[] DEFAULT ARRAY[false, false, false, false, false, false, false]::BOOLEAN[],
    "start" TEXT[] DEFAULT ARRAY['', '', '', '', '', '', '']::TEXT[],
    "end" TEXT[] DEFAULT ARRAY['', '', '', '', '', '', '']::TEXT[],

    CONSTRAINT "Timing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Timing_mentorId_key" ON "Timing"("mentorId");

-- AddForeignKey
ALTER TABLE "Timing" ADD CONSTRAINT "Timing_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
