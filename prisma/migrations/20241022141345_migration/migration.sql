/*
  Warnings:

  - You are about to drop the `SpaceEmailVerification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('EXPIRED', 'ACTIVE');

-- DropForeignKey
ALTER TABLE "SpaceEmailVerification" DROP CONSTRAINT "SpaceEmailVerification_space_id_fkey";

-- DropTable
DROP TABLE "SpaceEmailVerification";

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "status" "KeyStatus" NOT NULL,
    "expire_time" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "spaceId" TEXT,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Token_token_key" ON "Token"("token");

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "Space"("id") ON DELETE SET NULL ON UPDATE CASCADE;
