/*
  Warnings:

  - The values [PENDING] on the enum `SpaceStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SpaceStatus_new" AS ENUM ('INITIATED', 'REVIEW', 'APPROVED', 'REJECTED');
ALTER TABLE "Space" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Space" ALTER COLUMN "status" TYPE "SpaceStatus_new" USING ("status"::text::"SpaceStatus_new");
ALTER TYPE "SpaceStatus" RENAME TO "SpaceStatus_old";
ALTER TYPE "SpaceStatus_new" RENAME TO "SpaceStatus";
DROP TYPE "SpaceStatus_old";
ALTER TABLE "Space" ALTER COLUMN "status" SET DEFAULT 'INITIATED';
COMMIT;

-- AlterTable
ALTER TABLE "Space" ALTER COLUMN "status" SET DEFAULT 'INITIATED';
