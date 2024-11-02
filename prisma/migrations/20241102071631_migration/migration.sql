/*
  Warnings:

  - You are about to drop the column `question_status` on the `QuestQNAQuestion` table. All the data in the column will be lost.
  - You are about to drop the column `selected_options` on the `QuestQNAQuestion` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "QuestQNAQuestion" DROP COLUMN "question_status",
DROP COLUMN "selected_options";
