/*
  Warnings:

  - You are about to drop the column `Instagram` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `sessionsCount` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `tools` on the `Mentor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "Instagram",
DROP COLUMN "price",
DROP COLUMN "sessionsCount",
DROP COLUMN "tools";

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
