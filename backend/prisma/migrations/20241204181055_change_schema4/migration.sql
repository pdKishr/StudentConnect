/*
  Warnings:

  - You are about to drop the column `collage` on the `Education` table. All the data in the column will be lost.
  - You are about to drop the column `currentPosition` on the `Mentor` table. All the data in the column will be lost.
  - Added the required column `college` to the `Education` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Education" DROP COLUMN "collage",
ADD COLUMN     "college" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "currentPosition",
ADD COLUMN     "profilePicture" TEXT;
