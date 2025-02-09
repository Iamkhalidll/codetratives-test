// src/prisma/seeds/category.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedCategories(prisma: PrismaClient) {
  try {
    // Read and parse the JSON file
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/categories.json'),
      'utf-8'
    );
    
    const categoriesData = JSON.parse(rawData);
    console.log('Loaded categories data:', Array.isArray(categoriesData) ? categoriesData.length : 1, 'categories'); // Debug log

    // Convert to array if single object
    const categories = Array.isArray(categoriesData) ? categoriesData : [categoriesData];

    for (const category of categories) {
      // Debug log
      console.log('Processing category:', category.name);
      
      // Ensure we have required fields
      if (!category.name || !category.slug) {
        console.warn('Skipping category due to missing required fields:', category);
        continue;
      }

      try {
        // First create the parent category
        const parentCategory = await prisma.category.upsert({
          where: {
            slug: category.slug
          },
          update: {
            name: category.name,
            slug: category.slug,
            icon: category.icon || null,
            image: category.image || null,
            details: category.details || null,
            language: category.language || 'en',
            translatedLanguages: category.translated_languages || ['en']
          },
          create: {
            name: category.name,
            slug: category.slug,
            icon: category.icon || null,
            image: category.image || null,
            details: category.details || null,
            language: category.language || 'en',
            translatedLanguages: category.translated_languages || ['en']
          },
        });

        // Then process children if they exist
        if (category.children && Array.isArray(category.children)) {
          console.log(`Processing ${category.children.length} children for category:`, category.name);
          
          for (const child of category.children) {
            if (!child.name || !child.slug) {
              console.warn('Skipping child category due to missing required fields:', child);
              continue;
            }

            try {
              await prisma.category.upsert({
                where: {
                  slug: child.slug
                },
                update: {
                  name: child.name,
                  slug: child.slug,
                  icon: child.icon || null,
                  image: child.image || null,
                  details: child.details || null,
                  language: child.language || 'en',
                  translatedLanguages: child.translated_languages || ['en'],
                  parent: {
                    connect: {
                      id: parentCategory.id
                    }
                  }
                },
                create: {
                  name: child.name,
                  slug: child.slug,
                  icon: child.icon || null,
                  image: child.image || null,
                  details: child.details || null,
                  language: child.language || 'en',
                  translatedLanguages: child.translated_languages || ['en'],
                  parent: {
                    connect: {
                      id: parentCategory.id
                    }
                  }
                },
              });
            } catch (error) {
              console.error(`❌ Error seeding child category ${child.name}:`, error);
            }
          }
        }
      } catch (error) {
        console.error(`❌ Error seeding category ${category.name}:`, error);
      }
    }
    
    console.log('✅ All categories seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}