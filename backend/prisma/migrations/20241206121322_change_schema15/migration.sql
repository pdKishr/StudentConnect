-- AlterTable
ALTER TABLE "AvailableTime" ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WorkExperience" ALTER COLUMN "startYear" DROP NOT NULL;
