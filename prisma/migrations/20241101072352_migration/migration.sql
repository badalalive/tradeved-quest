/*
  Warnings:

  - You are about to drop the column `desctiption` on the `Option` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Option" DROP COLUMN "desctiption",
ADD COLUMN     "description" TEXT;
