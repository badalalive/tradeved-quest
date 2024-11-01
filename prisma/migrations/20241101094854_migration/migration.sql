/*
  Warnings:

  - You are about to drop the column `vote_type` on the `QuestParticipantVote` table. All the data in the column will be lost.
  - You are about to drop the column `downvotes` on the `QuestVote` table. All the data in the column will be lost.
  - You are about to drop the column `upvotes` on the `QuestVote` table. All the data in the column will be lost.
  - Added the required column `option_id` to the `QuestParticipantVote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestParticipantVote" DROP COLUMN "vote_type",
ADD COLUMN     "option_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestVote" DROP COLUMN "downvotes",
DROP COLUMN "upvotes";

-- CreateTable
CREATE TABLE "QuestVoteOption" (
    "id" TEXT NOT NULL,
    "quest_vote_id" TEXT NOT NULL,
    "option_text" VARCHAR(255) NOT NULL,
    "vote_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestVoteOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestVoteOption_id_key" ON "QuestVoteOption"("id");

-- AddForeignKey
ALTER TABLE "QuestVoteOption" ADD CONSTRAINT "QuestVoteOption_quest_vote_id_fkey" FOREIGN KEY ("quest_vote_id") REFERENCES "QuestVote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestParticipantVote" ADD CONSTRAINT "QuestParticipantVote_option_id_fkey" FOREIGN KEY ("option_id") REFERENCES "QuestVoteOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
