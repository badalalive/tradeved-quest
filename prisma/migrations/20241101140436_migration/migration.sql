/*
  Warnings:

  - A unique constraint covering the columns `[quest_id,participant_id]` on the table `QuestParticipant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE INDEX "QuestParticipant_quest_id_participant_id_idx" ON "QuestParticipant"("quest_id", "participant_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestParticipant_quest_id_participant_id_key" ON "QuestParticipant"("quest_id", "participant_id");
