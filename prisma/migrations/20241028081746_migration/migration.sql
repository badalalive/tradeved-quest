/*
  Warnings:

  - You are about to drop the column `template_id` on the `Quest` table. All the data in the column will be lost.
  - You are about to drop the `QuestTemplate` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quest" DROP CONSTRAINT "Quest_template_id_fkey";

-- DropIndex
DROP INDEX "Quest_template_id_key";

-- AlterTable
ALTER TABLE "Quest" DROP COLUMN "template_id";

-- DropTable
DROP TABLE "QuestTemplate";
