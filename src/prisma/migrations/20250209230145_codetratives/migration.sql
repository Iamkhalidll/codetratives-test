/*
  Warnings:

  - Added the required column `shopId` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "salePrice" DECIMAL(65,30),
ADD COLUMN     "shopId" INTEGER NOT NULL,
ADD COLUMN     "typeId" INTEGER;
