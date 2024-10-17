-- CreateEnum
CREATE TYPE "QuestStatus" AS ENUM ('DRAFTED', 'INITIATED', 'SCHEDULED', 'PAUSED', 'RUNNING', 'ENDED');

-- CreateEnum
CREATE TYPE "QuestTemplateCategory" AS ENUM ('GENERAL', 'TIMED', 'MINI_GAMES', 'VOTE');

-- CreateTable
CREATE TABLE "Space" (
    "id" TEXT NOT NULL,
    "company_name" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
    "banner" VARCHAR(255),
    "logo_url" VARCHAR(255),
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "Space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceEmailVerification" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "is_expired" BOOLEAN NOT NULL DEFAULT false,
    "space_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "SpaceEmailVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceLinks" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,

    CONSTRAINT "SpaceLinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpaceDocuments" (
    "id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,

    CONSTRAINT "SpaceDocuments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quest" (
    "id" TEXT NOT NULL,
    "space_id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "participant_limit" INTEGER NOT NULL,
    "max_reward_point" INTEGER NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "reattempt" INTEGER NOT NULL,
    "status" "QuestStatus" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "template_id" TEXT NOT NULL,

    CONSTRAINT "Quest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestTemplate" (
    "id" TEXT NOT NULL,
    "template_name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "category" "QuestTemplateCategory" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Space_id_key" ON "Space"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Space_email_key" ON "Space"("email");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceEmailVerification_id_key" ON "SpaceEmailVerification"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceEmailVerification_token_key" ON "SpaceEmailVerification"("token");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceLinks_id_key" ON "SpaceLinks"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SpaceDocuments_id_key" ON "SpaceDocuments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_id_key" ON "Quest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Quest_template_id_key" ON "Quest"("template_id");

-- CreateIndex
CREATE UNIQUE INDEX "QuestTemplate_id_key" ON "QuestTemplate"("id");

-- AddForeignKey
ALTER TABLE "SpaceEmailVerification" ADD CONSTRAINT "SpaceEmailVerification_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceLinks" ADD CONSTRAINT "SpaceLinks_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpaceDocuments" ADD CONSTRAINT "SpaceDocuments_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quest" ADD CONSTRAINT "Quest_template_id_fkey" FOREIGN KEY ("template_id") REFERENCES "QuestTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
