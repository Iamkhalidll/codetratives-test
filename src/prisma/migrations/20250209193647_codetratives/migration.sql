/*
  Warnings:

  - You are about to drop the column `avatar` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `notifications` on the `profiles` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "avatar",
DROP COLUMN "notifications",
ADD COLUMN     "avatarId" TEXT,
ADD COLUMN     "avatarOriginal" TEXT,
ADD COLUMN     "avatarThumbnail" TEXT,
ADD COLUMN     "notificationEmail" TEXT,
ADD COLUMN     "notificationEnable" BOOLEAN NOT NULL DEFAULT false;
