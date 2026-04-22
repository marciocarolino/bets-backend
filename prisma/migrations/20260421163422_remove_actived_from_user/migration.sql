/*
  Warnings:

  - You are about to drop the column `actived` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "actived",
ADD COLUMN     "active" BOOLEAN NOT NULL DEFAULT true;
