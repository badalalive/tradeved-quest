/*
  Warnings:

  - A unique constraint covering the columns `[quest_vote_id,participant_id]` on the table `QuestParticipantVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuestParticipantVote_quest_vote_id_participant_id_key" ON "QuestParticipantVote"("quest_vote_id", "participant_id");
