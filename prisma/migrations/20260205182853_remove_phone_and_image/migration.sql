/*
  Warnings:

  - You are about to drop the column `phone` on the `Owner` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Owner" DROP COLUMN "phone",
ADD COLUMN     "password" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "phone",
ADD COLUMN     "password" TEXT;
