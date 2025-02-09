/*
  Warnings:

  - You are about to drop the column `categoryId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `typeId` on the `products` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "categoryId",
DROP COLUMN "salePrice",
DROP COLUMN "shopId",
DROP COLUMN "typeId",
ADD COLUMN     "category_id" INTEGER;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
