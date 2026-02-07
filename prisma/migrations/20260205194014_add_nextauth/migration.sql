-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'OWNER');

-- AlterTable
ALTER TABLE "Owner" ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER';
