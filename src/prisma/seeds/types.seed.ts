// src/prisma/seeds/type.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedTypes(prisma: PrismaClient) {
  try {
    // Read and parse the JSON file
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/types.json'),
      'utf-8'
    );
    
    const typesData = JSON.parse(rawData);
    console.log('Loaded types data:', Array.isArray(typesData) ? typesData.length : 1, 'types');

    // Convert to array if single object
    const types = Array.isArray(typesData) ? typesData : [typesData];

    for (const type of types) {
      try {
        const typeData = {
          name: type.name,
          language: type.language || 'en',
          translated_languages: type.translated_languages || ['en'],
          slug: type.slug,
          icon: type.icon,
          settings: type.settings || {},
          banners: type.banners || [],
          promotional_sliders: type.promotional_sliders || []
        };

        const result = await prisma.type.upsert({
          where: { id: type.id },
          update: typeData,
          create: typeData
        });

        console.log(`✅ Successfully seeded type: ${result.name}`);
      } catch (error) {
        console.error(`❌ Error seeding type ${type.name}:`, error);
      }
    }

    console.log('✅ Finished seeding types');
  } catch (error) {
    console.error('❌ Error reading or parsing type data:', error);
    throw error;
  }
}