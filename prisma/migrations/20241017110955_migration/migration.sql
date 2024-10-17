-- CreateEnum
CREATE TYPE "SpaceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "reject_reason" TEXT,
ADD COLUMN     "status" "SpaceStatus" NOT NULL DEFAULT 'PENDING';
