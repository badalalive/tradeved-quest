/*
  Warnings:

  - Added the required column `content_type` to the `Quest` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestContentType" AS ENUM ('TEXT', 'VIDEO', 'IMAGE');

-- AlterTable
ALTER TABLE "Quest" ADD COLUMN     "content_type" "QuestContentType" NOT NULL;
