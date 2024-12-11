/*
  Warnings:

  - You are about to drop the column `timerange` on the `Availability` table. All the data in the column will be lost.
  - You are about to drop the column `bookingStatus` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `endTime` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slotId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `end` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `Availability` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slotId` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('upcoming', 'cancelled', 'completed');

-- AlterTable
ALTER TABLE "Availability" DROP COLUMN "timerange",
ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "start" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "bookingStatus",
DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "slotId" TEXT NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'upcoming',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Slot" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Slot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Slot_mentorId_start_idx" ON "Slot"("mentorId", "start");

-- CreateIndex
CREATE UNIQUE INDEX "Booking_slotId_key" ON "Booking"("slotId");

-- AddForeignKey
ALTER TABLE "Slot" ADD CONSTRAINT "Slot_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
