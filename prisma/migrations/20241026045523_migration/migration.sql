/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `Space` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Space" ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Space_user_id_key" ON "Space"("user_id");
