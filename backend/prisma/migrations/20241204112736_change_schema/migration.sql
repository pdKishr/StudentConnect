/*
  Warnings:

  - You are about to drop the column `availableTimes` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `bio` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `company` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `currentPostion` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `expertiseAreas` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `githubProfile` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `industry` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinprofile` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `menteeLimit` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `portfolio` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `profilePicture` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `skills` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `workExperience` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `name` to the `Mentor` table without a default value. This is not possible if the table is not empty.
  - Made the column `mobile_number` on table `Mentor` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('upcoming', 'ongoing', 'completed');

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "availableTimes",
DROP COLUMN "bio",
DROP COLUMN "company",
DROP COLUMN "currentPostion",
DROP COLUMN "expertiseAreas",
DROP COLUMN "firstname",
DROP COLUMN "githubProfile",
DROP COLUMN "industry",
DROP COLUMN "lastname",
DROP COLUMN "linkedinprofile",
DROP COLUMN "menteeLimit",
DROP COLUMN "portfolio",
DROP COLUMN "profilePicture",
DROP COLUMN "role",
DROP COLUMN "skills",
DROP COLUMN "workExperience",
ADD COLUMN     "Instagram" TEXT,
ADD COLUMN     "about" TEXT,
ADD COLUMN     "availableTime" TEXT[],
ADD COLUMN     "currentPosition" TEXT,
ADD COLUMN     "currentlyWorking" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "expertiseArea" TEXT,
ADD COLUMN     "language" TEXT[],
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "menteeMinutes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "menteesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "skill" TEXT[],
ADD COLUMN     "yearsofExperience" INTEGER,
ALTER COLUMN "mobile_number" SET NOT NULL;

-- DropTable
DROP TABLE "Student";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "language" TEXT[],
    "city" TEXT,
    "state" TEXT,
    "country" TEXT,
    "profilePicture" TEXT,
    "linkedin" TEXT,
    "resume" TEXT,
    "highestDegree" TEXT,
    "course" TEXT,
    "College" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "collage" TEXT NOT NULL,
    "degree" TEXT NOT NULL,
    "course" TEXT NOT NULL,
    "startYear" INTEGER,
    "endYear" INTEGER,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkExperience" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "startYear" INTEGER NOT NULL,
    "endYear" INTEGER,

    CONSTRAINT "WorkExperience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "bookingStatus" "status" NOT NULL DEFAULT 'upcoming',
    "startTime" TIMESTAMP(3) NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verifyBox" TEXT[],

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_number_key" ON "User"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkExperience" ADD CONSTRAINT "WorkExperience_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
