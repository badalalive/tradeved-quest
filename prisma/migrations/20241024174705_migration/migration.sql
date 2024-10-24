/*
  Warnings:

  - You are about to drop the column `category` on the `QuestTemplate` table. All the data in the column will be lost.
  - Added the required column `category` to the `Quest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `created_by` to the `Quest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_by` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestCategory" AS ENUM ('GENERAL', 'TIMED', 'MINI_GAMES', 'DAILY');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('SINGLE', 'MULTIPLE');

-- CreateEnum
CREATE TYPE "QuestionStatus" AS ENUM ('UNATTEMPTED', 'CORRECT', 'INCORRECT');

-- CreateEnum
CREATE TYPE "QuestCompletionStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('UPVOTE', 'DOWNVOTE');

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "category" "QuestCategory" NOT NULL,
ADD COLUMN     "created_by" TEXT NOT NULL,
ADD COLUMN     "quest_time" INTEGER,
ADD COLUMN     "updated_by" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "QuestTemplate" DROP COLUMN "category";

-- DropEnum
DROP TYPE "QuestTemplateCategory";

-- CreateTable
CREATE TABLE "QuestParticipant" (
    "id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completion_status" "QuestCompletionStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "score" INTEGER,
    "reward_points" INTEGER,
    "reward_collected" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "reattempt_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestQNA" (
    "id" TEXT NOT NULL,
    "total_question" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestQNA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "question" VARCHAR(500) NOT NULL,
    "answer_type" "AnswerType" NOT NULL DEFAULT 'SINGLE',

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestQNAQuestion" (
    "id" TEXT NOT NULL,
    "questQna_id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "question_status" "QuestionStatus" NOT NULL DEFAULT 'UNATTEMPTED',
    "selected_options" TEXT,

    CONSTRAINT "QuestQNAQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Answer" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestVote" (
    "id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "news_item" VARCHAR(255) NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,
    "downvotes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestParticipantVote" (
    "id" TEXT NOT NULL,
    "quest_vote_id" TEXT NOT NULL,
    "participant_id" TEXT NOT NULL,
    "vote_type" "VoteType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestParticipantVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestVoteDiscussion" (
    "id" TEXT NOT NULL,
    "quest_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "comment" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestVoteDiscussion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestParticipant_id_key" ON "QuestParticipant"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestQNA_id_key" ON "QuestQNA"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_key" ON "Question"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestQNAQuestion_id_key" ON "QuestQNAQuestion"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Option_id_key" ON "Option"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Answer_id_key" ON "Answer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestVote_id_key" ON "QuestVote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestParticipantVote_id_key" ON "QuestParticipantVote"("id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestVoteDiscussion_id_key" ON "QuestVoteDiscussion"("id");

-- AddForeignKey
ALTER TABLE "QuestParticipant" ADD CONSTRAINT "QuestParticipant_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestQNAQuestion" ADD CONSTRAINT "QuestQNAQuestion_questQna_id_fkey" FOREIGN KEY ("questQna_id") REFERENCES "QuestQNA"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestQNAQuestion" ADD CONSTRAINT "QuestQNAQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestVote" ADD CONSTRAINT "QuestVote_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestParticipantVote" ADD CONSTRAINT "QuestParticipantVote_quest_vote_id_fkey" FOREIGN KEY ("quest_vote_id") REFERENCES "QuestVote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestVoteDiscussion" ADD CONSTRAINT "QuestVoteDiscussion_quest_id_fkey" FOREIGN KEY ("quest_id") REFERENCES "Quest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
