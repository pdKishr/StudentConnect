/*
  Warnings:

  - You are about to drop the column `availableTime` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `expertiseArea` on the `Mentor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Day" AS ENUM ('mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun');

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "availableTime",
DROP COLUMN "expertiseArea",
ADD COLUMN     "domain" TEXT,
ADD COLUMN     "price_1month" INTEGER,
ADD COLUMN     "price_3month" INTEGER,
ADD COLUMN     "price_6month" INTEGER,
ADD COLUMN     "sessionsCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sessionsPerMonth" INTEGER,
ADD COLUMN     "tools" TEXT[];

-- CreateTable
CREATE TABLE "AvailableTime" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "day" "Day" NOT NULL,
    "availability" BOOLEAN NOT NULL DEFAULT true,
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AvailableTime_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AvailableTime" ADD CONSTRAINT "AvailableTime_id_fkey" FOREIGN KEY ("id") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
