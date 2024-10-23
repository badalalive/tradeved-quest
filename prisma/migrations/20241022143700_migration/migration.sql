/*
  Warnings:

  - You are about to drop the column `spaceId` on the `Token` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Token" DROP CONSTRAINT "Token_spaceId_fkey";

-- AlterTable
ALTER TABLE "Token" DROP COLUMN "spaceId",
ADD COLUMN     "space_id" TEXT;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_space_id_fkey" FOREIGN KEY ("space_id") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;
