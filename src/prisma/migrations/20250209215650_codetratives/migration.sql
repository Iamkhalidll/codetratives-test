/*
  Warnings:

  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- DropTable
DROP TABLE "Category";

-- DropTable
DROP TABLE "Product";

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "image" JSONB,
    "details" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en',
    "translated_languages" TEXT[],
    "parentId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "types" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "translated_languages" TEXT[],
    "settings" JSONB NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "promotional_sliders" JSONB[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "type_id" INTEGER,
    "price" DECIMAL(10,2) NOT NULL,
    "shop_id" INTEGER NOT NULL,
    "sale_price" DECIMAL(10,2),
    "language" TEXT NOT NULL DEFAULT 'en',
    "min_price" DECIMAL(10,2) NOT NULL,
    "max_price" DECIMAL(10,2) NOT NULL,
    "sku" TEXT,
    "quantity" INTEGER NOT NULL DEFAULT 0,
    "sold_quantity" INTEGER NOT NULL DEFAULT 0,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "is_taxable" BOOLEAN NOT NULL DEFAULT false,
    "in_flash_sale" BOOLEAN NOT NULL DEFAULT false,
    "shipping_class_id" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "product_type" TEXT NOT NULL DEFAULT 'simple',
    "unit" TEXT,
    "height" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "length" DOUBLE PRECISION,
    "image" JSONB,
    "video" JSONB,
    "gallery" JSONB[],
    "deleted_at" TIMESTAMP(3),
    "author_id" INTEGER,
    "manufacturer_id" INTEGER,
    "is_digital" BOOLEAN NOT NULL DEFAULT false,
    "is_external" BOOLEAN NOT NULL DEFAULT false,
    "external_product_url" TEXT,
    "external_product_button_text" TEXT,
    "blocked_dates" JSONB[],
    "orders_count" INTEGER NOT NULL DEFAULT 0,
    "ratings" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "rating_count" JSONB[],
    "translated_languages" TEXT[],
    "categoryId" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_parentId_idx" ON "categories"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "types_slug_key" ON "types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- CreateIndex
CREATE INDEX "products_shop_id_idx" ON "products"("shop_id");

-- CreateIndex
CREATE INDEX "products_type_id_idx" ON "products"("type_id");

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "Shop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
