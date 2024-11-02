-- CreateTable
CREATE TABLE "QuestQNAParticipantAnswer" (
    "id" TEXT NOT NULL,
    "questQnaQuestionId" TEXT NOT NULL,
    "participantId" TEXT NOT NULL,
    "selected_options" TEXT,
    "question_status" "QuestionStatus" NOT NULL DEFAULT 'UNATTEMPTED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestQNAParticipantAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestQNAParticipantAnswer_id_key" ON "QuestQNAParticipantAnswer"("id");

-- AddForeignKey
ALTER TABLE "QuestQNAParticipantAnswer" ADD CONSTRAINT "QuestQNAParticipantAnswer_questQnaQuestionId_fkey" FOREIGN KEY ("questQnaQuestionId") REFERENCES "QuestQNAQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
