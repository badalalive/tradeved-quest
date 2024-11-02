/*
  Warnings:

  - You are about to drop the column `questQnaQuestionId` on the `QuestQNAParticipantAnswer` table. All the data in the column will be lost.
  - Added the required column `questQna_id` to the `QuestQNAParticipantAnswer` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestQNAParticipantAnswer" DROP CONSTRAINT "QuestQNAParticipantAnswer_questQnaQuestionId_fkey";

-- AlterTable
ALTER TABLE "QuestQNAParticipantAnswer" DROP COLUMN "questQnaQuestionId",
ADD COLUMN     "questQna_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestQNAParticipantAnswer" ADD CONSTRAINT "QuestQNAParticipantAnswer_questQna_id_fkey" FOREIGN KEY ("questQna_id") REFERENCES "QuestQNA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
