/*
  Warnings:

  - You are about to drop the column `price_1month` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `price_3month` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `price_6month` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `sessionsPerMonth` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TrialBooking` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_userId_fkey";

-- DropForeignKey
ALTER TABLE "TrialBooking" DROP CONSTRAINT "TrialBooking_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "TrialBooking" DROP CONSTRAINT "TrialBooking_userId_fkey";

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "price_1month",
DROP COLUMN "price_3month",
DROP COLUMN "price_6month",
DROP COLUMN "sessionsPerMonth",
ADD COLUMN     "price" INTEGER;

-- DropTable
DROP TABLE "Purchase";

-- DropTable
DROP TABLE "TrialBooking";

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "bookingStatus" "status" NOT NULL DEFAULT 'upcoming',
    "startTime" TEXT NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
