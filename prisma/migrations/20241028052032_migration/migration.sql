/*
  Warnings:

  - Made the column `order` on table `ModuleQuest` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Module" ALTER COLUMN "image_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ModuleQuest" ALTER COLUMN "order" SET NOT NULL;
