/*
  Warnings:

  - The values [INITIATED] on the enum `QuestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "QuestApprovalStatus" AS ENUM ('REVIEW', 'APPROVED', 'REJECTED', 'INITIATED');

-- AlterEnum
BEGIN;
CREATE TYPE "QuestStatus_new" AS ENUM ('DRAFTED', 'SCHEDULED', 'PAUSED', 'RUNNING', 'ENDED');
ALTER TABLE "Quest" ALTER COLUMN "status" TYPE "QuestStatus_new" USING ("status"::text::"QuestStatus_new");
ALTER TYPE "QuestStatus" RENAME TO "QuestStatus_old";
ALTER TYPE "QuestStatus_new" RENAME TO "QuestStatus";
DROP TYPE "QuestStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "approval_status" "QuestApprovalStatus" NOT NULL DEFAULT 'INITIATED';
