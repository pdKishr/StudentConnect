-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isComplete" BOOLEAN NOT NULL DEFAULT false;
