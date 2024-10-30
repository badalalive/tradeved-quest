/*
  Warnings:

  - The values [RUNNING] on the enum `QuestStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestStatus_new" AS ENUM ('DRAFTED', 'SCHEDULED', 'PAUSED', 'PUBLISH', 'ENDED');
ALTER TABLE "Quest" ALTER COLUMN "status" TYPE "QuestStatus_new" USING ("status"::text::"QuestStatus_new");
ALTER TYPE "QuestStatus" RENAME TO "QuestStatus_old";
ALTER TYPE "QuestStatus_new" RENAME TO "QuestStatus";
DROP TYPE "QuestStatus_old";
COMMIT;
