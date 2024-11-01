/*
  Warnings:

  - The values [IN_PROGRESS] on the enum `QuestCompletionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestCompletionStatus_new" AS ENUM ('NOT_STARTED', 'INCOMPLETED', 'COMPLETED', 'FAILED');
ALTER TABLE "QuestParticipant" ALTER COLUMN "completion_status" DROP DEFAULT;
ALTER TABLE "QuestParticipant" ALTER COLUMN "completion_status" TYPE "QuestCompletionStatus_new" USING ("completion_status"::text::"QuestCompletionStatus_new");
ALTER TYPE "QuestCompletionStatus" RENAME TO "QuestCompletionStatus_old";
ALTER TYPE "QuestCompletionStatus_new" RENAME TO "QuestCompletionStatus";
DROP TYPE "QuestCompletionStatus_old";
ALTER TABLE "QuestParticipant" ALTER COLUMN "completion_status" SET DEFAULT 'NOT_STARTED';
COMMIT;
