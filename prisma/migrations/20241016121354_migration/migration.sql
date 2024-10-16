/*
  Warnings:

  - Added the required column `path` to the `SpaceDocuments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SpaceDocuments` ADD COLUMN `path` VARCHAR(191) NOT NULL;
