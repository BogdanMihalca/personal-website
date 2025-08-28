/*
  Warnings:

  - You are about to drop the column `userId` on the `PostView` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "PostView" DROP CONSTRAINT "PostView_userId_fkey";

-- AlterTable
ALTER TABLE "PostView" DROP COLUMN "userId";
