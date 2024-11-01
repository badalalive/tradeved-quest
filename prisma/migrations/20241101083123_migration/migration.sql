-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "logo_url" TEXT;

-- AlterTable
ALTER TABLE "QuestVote" ALTER COLUMN "news_item" SET DATA TYPE VARCHAR(1000);
