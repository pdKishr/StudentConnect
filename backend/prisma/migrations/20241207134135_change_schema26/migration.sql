/*
  Warnings:

  - You are about to drop the `Timing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Timing" DROP CONSTRAINT "Timing_mentorId_fkey";

-- DropTable
DROP TABLE "Timing";

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL,
    "day" INTEGER NOT NULL,
    "timerange" JSONB[],

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
