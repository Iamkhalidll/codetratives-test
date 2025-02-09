/*
  Warnings:

  - You are about to drop the `types` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_type_id_fkey";

-- DropTable
DROP TABLE "types";

-- CreateTable
CREATE TABLE "Type" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "translatedLanguages" TEXT[],
    "icon" TEXT,
    "settings" JSONB,
    "banners" JSONB[],
    "promotionalSliders" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Type_slug_key" ON "Type"("slug");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "Type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
