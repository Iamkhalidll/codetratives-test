// prisma/seeds/attribute.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedAttributes(prisma: PrismaClient) {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/attributes.json'),
      'utf-8'
    );
    
    const attributesData = JSON.parse(rawData);
    console.log(`Found ${Array.isArray(attributesData) ? attributesData.length : 1} attributes to seed`);

    // Process each attribute
    const attributes = Array.isArray(attributesData) ? attributesData : [attributesData];
    
    for (const attribute of attributes) {
      try {
        // First create or update the attribute
        const createdAttribute = await prisma.attribute.upsert({
          where: { 
            id: attribute.id 
          },
          update: {
            name: attribute.name,
            shopId: attribute.shop_id,
            language: attribute.language || 'en',
            translatedLanguages: attribute.translated_languages || ['en'],
            slug: attribute.slug,
            type: attribute.type || null,
          },
          create: {
            id: attribute.id,
            name: attribute.name,
            shopId: attribute.shop_id,
            language: attribute.language || 'en',
            translatedLanguages: attribute.translated_languages || ['en'],
            slug: attribute.slug,
            type: attribute.type || null,
          },
        });

        // Then create or update each attribute value
        if (attribute.values && Array.isArray(attribute.values)) {
          for (const value of attribute.values) {
            await prisma.attributeValue.upsert({
              where: {
                id: value.id
              },
              update: {
                value: value.value,
                slug: value.slug,
                meta: value.meta || null,
                language: value.language || 'en',
                translatedLanguages: value.translated_languages || ['en'],
                attributeId: createdAttribute.id
              },
              create: {
                id: value.id,
                value: value.value,
                slug: value.slug,
                meta: value.meta || null,
                language: value.language || 'en',
                translatedLanguages: value.translated_languages || ['en'],
                attributeId: createdAttribute.id
              },
            });
          }
        }
        
        console.log(`✅ Seeded attribute: ${attribute.name} with ${attribute.values?.length || 0} values`);
      } catch (error) {
        console.error(`❌ Error seeding attribute ${attribute.name}:`, error);
      }
    }

    console.log('✅ Attributes seeding completed');
  } catch (error) {
    console.error('❌ Error seeding attributes:', error);
    throw error;
  }
}