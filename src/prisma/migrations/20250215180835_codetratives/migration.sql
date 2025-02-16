/*
  Warnings:

  - You are about to drop the column `promotionalSliders` on the `Type` table. All the data in the column will be lost.
  - You are about to drop the column `translatedLanguages` on the `Type` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Type" DROP COLUMN "promotionalSliders",
DROP COLUMN "translatedLanguages",
ADD COLUMN     "promotional_sliders" JSONB[],
ADD COLUMN     "translated_languages" TEXT[];
