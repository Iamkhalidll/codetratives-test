import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedProducts(prisma: PrismaClient) {
  try {
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/products.json'),
      'utf-8'
    );

    const productsData = JSON.parse(rawData);
    const products = Array.isArray(productsData) ? productsData : [productsData];

    for (const product of products) {
      console.log('Processing product:', product.name);

      if (!product.name || !product.slug || !product.shop?.id) {
        console.warn('Skipping product due to missing required fields:', product);
        continue;
      }

      try {
        // Ensure the shop exists before linking products to it
        const existingShop = await prisma.shop.findUnique({
          where: { id: product.shop.id },
        });

        if (!existingShop) {
          console.warn(`Skipping product "${product.name}" as shop ID ${product.shop.id} does not exist.`);
          continue;
        }

        // Ensure the type exists before linking products to it
        const existingType = product.type?.id
          ? await prisma.type.findUnique({ where: { id: product.type.id } })
          : null;

        if (product.type?.id && !existingType) {
          console.warn(`Skipping product "${product.name}" as type ID ${product.type.id} does not exist.`);
          continue;
        }

        // Ensure categoryId exists before linking it
        const categoryId = product.category?.id || null;

        // Check for duplicate slug
        const existingProduct = await prisma.product.findUnique({
          where: { slug: product.slug },
        });

        if (existingProduct) {
          console.warn(`Skipping product "${product.name}" due to duplicate slug: ${product.slug}`);
          continue;
        }

        // Prepare Product Data
        const productData = {
          name: product.name,
          slug: product.slug,
          description: product.description || null,
          type_id: existingType ? product.type.id : null,
          price: parseFloat(product.price.toString()),
          shop_id: product.shop.id,
          sale_price: product.sale_price ? parseFloat(product.sale_price.toString()) : null,
          language: product.language || 'en',
          min_price: parseFloat(product.min_price.toString()),
          max_price: parseFloat(product.max_price.toString()),
          sku: product.sku || null,
          quantity: product.quantity || 0,
          sold_quantity: product.sold_quantity || 0,
          in_stock: Boolean(product.in_stock),
          is_taxable: Boolean(product.is_taxable),
          in_flash_sale: Boolean(product.in_flash_sale),
          shipping_class_id: product.shipping_class_id || null,
          status: product.status || 'draft',
          product_type: product.product_type || 'simple',
          unit: product.unit || null,
          height: product.height || null,
          width: product.width || null,
          length: product.length || null,
          image: product.image || null,
          video: product.video || null,
          gallery: product.gallery || [],
          author_id: product.author_id || null,
          manufacturer_id: product.manufacturer_id || null,
          is_digital: Boolean(product.is_digital),
          is_external: Boolean(product.is_external),
          external_product_url: product.external_product_url || null,
          external_product_button_text: product.external_product_button_text || null,
          blocked_dates: product.blocked_dates || [],
          orders_count: product.orders_count || 0,
          ratings: product.ratings || 0,
          total_reviews: product.total_reviews || 0,
          rating_count: product.rating_count || [],
          translated_languages: product.translated_languages || ['en'],
          categoryId: categoryId,
        };

        // Create product
        await prisma.product.create({
          data: productData,
        });

        console.log(`✅ Successfully added product: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error processing product ${product.name}:`, error);
      }
    }

    console.log('✅ All products seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}
