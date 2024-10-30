/*
  Warnings:

  - You are about to drop the column `quest_id` on the `QuestVoteDiscussion` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[questId]` on the table `QuestQNA` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[quest_id]` on the table `QuestVote` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questId` to the `QuestQNA` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quest_vote_id` to the `QuestVoteDiscussion` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestVoteDiscussion" DROP CONSTRAINT "QuestVoteDiscussion_quest_id_fkey";

-- AlterTable
ALTER TABLE "QuestQNA" ADD COLUMN     "questId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestVoteDiscussion" DROP COLUMN "quest_id",
ADD COLUMN     "quest_vote_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "QuestQNA_questId_key" ON "QuestQNA"("questId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestVote_quest_id_key" ON "QuestVote"("quest_id");

-- AddForeignKey
ALTER TABLE "QuestQNA" ADD CONSTRAINT "QuestQNA_questId_fkey" FOREIGN KEY ("questId") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestVoteDiscussion" ADD CONSTRAINT "QuestVoteDiscussion_quest_vote_id_fkey" FOREIGN KEY ("quest_vote_id") REFERENCES "QuestVote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
