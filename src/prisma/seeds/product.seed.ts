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
    console.log('Loaded products data:', Array.isArray(productsData) ? productsData.length : 1, 'products');

    // Convert to array if single object
    const products = Array.isArray(productsData) ? productsData : [productsData];

    for (const product of products) {
      console.log('Processing product:', product.name);
      
      // Ensure we have required fields
      if (!product.name || !product.slug) {
        console.warn('Skipping product due to missing required fields:', product);
        continue;
      }

      try {
        // First ensure type exists if provided
        if (product.type && product.type_id) {
          await prisma.type.upsert({
            where: { id: product.type.id },
            update: {
              name: product.type.name,
              settings: product.type.settings,
              slug: product.type.slug,
              language: product.type.language,
              icon: product.type.icon,
              promotional_sliders: product.type.promotional_sliders || [],
              translatedLanguages: product.type.translated_languages || ['en']
            },
            create: {
              id: product.type.id,
              name: product.type.name,
              settings: product.type.settings,
              slug: product.type.slug,
              language: product.type.language,
              icon: product.type.icon,
              promotional_sliders: product.type.promotional_sliders || [],
              translatedLanguages: product.type.translated_languages || ['en']
            }
          });
        }

        // Then ensure shop exists if provided
        if (product.shop && product.shop_id) {
          await prisma.shop.upsert({
            where: { id: product.shop.id },
            update: {
              name: product.shop.name,
              ownerId: product.shop.owner_id,
              slug: product.shop.slug,
              description: product.shop.description,
              coverImage: product.shop.cover_image,
              logo: product.shop.logo,
              isActive: Boolean(product.shop.is_active),
              address: product.shop.address,
              settings: product.shop.settings
            },
            create: {
              id: product.shop.id,
              name: product.shop.name,
              ownerId: product.shop.owner_id,
              slug: product.shop.slug,
              description: product.shop.description,
              coverImage: product.shop.cover_image,
              logo: product.shop.logo,
              isActive: Boolean(product.shop.is_active),
              address: product.shop.address,
              settings: product.shop.settings
            }
          });
        }

        await prisma.product.upsert({
          where: {
            slug: product.slug
          },
          update: {
            name: product.name,
            description: product.description || null,
            type_id: product.type_id,
            price: parseFloat(product.price.toString()),
            shop_id: product.shop_id,
            sale_price: product.sale_price ? parseFloat(product.sale_price.toString()) : null,
            language: product.language || 'en',
            min_price: parseFloat(product.min_price.toString()),
            max_price: parseFloat(product.max_price.toString()),
            sku: product.sku,
            quantity: product.quantity || 0,
            sold_quantity: product.sold_quantity || 0,
            in_stock: Boolean(product.in_stock),
            is_taxable: Boolean(product.is_taxable),
            in_flash_sale: Boolean(product.in_flash_sale),
            shipping_class_id: product.shipping_class_id,
            status: product.status || 'draft',
            product_type: product.product_type || 'simple',
            unit: product.unit || null,
            height: product.height,
            width: product.width,
            length: product.length,
            image: product.image || null,
            video: product.video || null,
            gallery: product.gallery || [],
            author_id: product.author_id,
            manufacturer_id: product.manufacturer_id,
            is_digital: Boolean(product.is_digital),
            is_external: Boolean(product.is_external),
            external_product_url: product.external_product_url,
            external_product_button_text: product.external_product_button_text,
            blocked_dates: product.blocked_dates || [],
            orders_count: product.orders_count || 0,
            ratings: product.ratings || 0,
            total_reviews: product.total_reviews || 0,
            rating_count: product.rating_count || [],
            translated_languages: product.translated_languages || ['en']
          },
          create: {
            name: product.name,
            slug: product.slug,
            description: product.description || null,
            type_id: product.type_id,
            price: parseFloat(product.price.toString()),
            shop_id: product.shop_id,
            sale_price: product.sale_price ? parseFloat(product.sale_price.toString()) : null,
            language: product.language || 'en',
            min_price: parseFloat(product.min_price.toString()),
            max_price: parseFloat(product.max_price.toString()),
            sku: product.sku,
            quantity: product.quantity || 0,
            sold_quantity: product.sold_quantity || 0,
            in_stock: Boolean(product.in_stock),
            is_taxable: Boolean(product.is_taxable),
            in_flash_sale: Boolean(product.in_flash_sale),
            shipping_class_id: product.shipping_class_id,
            status: product.status || 'draft',
            product_type: product.product_type || 'simple',
            unit: product.unit || null,
            height: product.height,
            width: product.width,
            length: product.length,
            image: product.image || null,
            video: product.video || null,
            gallery: product.gallery || [],
            author_id: product.author_id,
            manufacturer_id: product.manufacturer_id,
            is_digital: Boolean(product.is_digital),
            is_external: Boolean(product.is_external),
            external_product_url: product.external_product_url,
            external_product_button_text: product.external_product_button_text,
            blocked_dates: product.blocked_dates || [],
            orders_count: product.orders_count || 0,
            ratings: product.ratings || 0,
            total_reviews: product.total_reviews || 0,
            rating_count: product.rating_count || [],
            translated_languages: product.translated_languages || ['en']
          }
        });

        console.log(`✅ Successfully processed product: ${product.name}`);
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