/*
  Warnings:

  - Added the required column `template` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestTemplate" AS ENUM ('QNA', 'VOTE');

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "template" "QuestTemplate" NOT NULL;
