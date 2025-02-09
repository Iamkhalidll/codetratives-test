// src/prisma/seeds/product.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedProducts(prisma: PrismaClient) {
  try {
    // Read and parse the JSON file
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/products.json'),
      'utf-8'
    );
    
    const productsData = JSON.parse(rawData);
    console.log('Loaded products data:', productsData.length, 'products'); // Debug log

    for (const product of productsData) {
      // Debug log
      console.log('Processing product:', product.name);
      
      // Ensure we have required fields
      if (!product.name || !product.slug) {
        console.warn('Skipping product due to missing required fields:', product);
        continue;
      }

      try {
        await prisma.product.upsert({
          where: {
            slug: product.slug
          },
          update: {
            name: product.name,
            description: product.description || null,
            image: product.image || null,
            gallery: product.gallery || [],
            quantity: product.quantity || 0,
            price: product.price ? parseFloat(product.price.toString()) : null,
            salePrice: product.sale_price ? parseFloat(product.sale_price.toString()) : null,
            unit: product.unit || null,
            productType: product.product_type || null,
            maxPrice: product.max_price ? parseFloat(product.max_price.toString()) : null,
            minPrice: product.min_price ? parseFloat(product.min_price.toString()) : null,
            status: "publish",
            tags: product.tags || [],
            variations: product.variations || []
          },
          create: {
            name: product.name,
            slug: product.slug,
            description: product.description || null,
            image: product.image || null,
            gallery: product.gallery || [],
            quantity: product.quantity || 0,
            price: product.price ? parseFloat(product.price.toString()) : null,
            salePrice: product.sale_price ? parseFloat(product.sale_price.toString()) : null,
            unit: product.unit || null,
            productType: product.product_type || null,
            maxPrice: product.max_price ? parseFloat(product.max_price.toString()) : null,
            minPrice: product.min_price ? parseFloat(product.min_price.toString()) : null,
            status: "publish",
            tags: product.tags || [],
            variations: product.variations || []
          },
        });
      } catch (error) {
        console.error(`❌ Error seeding product ${product.name}:`, error);
      }
    }
    
    console.log('✅ All products seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
}