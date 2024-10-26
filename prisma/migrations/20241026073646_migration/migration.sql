-- CreateEnum
CREATE TYPE "QuestViewStatus" AS ENUM ('PRIVATE', 'PUBLIC');

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "view_status" "QuestViewStatus" NOT NULL DEFAULT 'PUBLIC';
