/*
  Warnings:

  - A unique constraint covering the columns `[questQna_id,participantId]` on the table `QuestQNAParticipantAnswer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "QuestQNAParticipantAnswer_questQna_id_participantId_idx" ON "QuestQNAParticipantAnswer"("questQna_id", "participantId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestQNAParticipantAnswer_questQna_id_participantId_key" ON "QuestQNAParticipantAnswer"("questQna_id", "participantId");
