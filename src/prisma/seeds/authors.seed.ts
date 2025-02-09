// prisma/seeds/author.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedAuthors(prisma: PrismaClient) {
  try {
    // Read the JSON file
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/authors.json'),
      'utf-8'
    );
    
    const authorsData = JSON.parse(rawData);
    console.log(`Found ${Array.isArray(authorsData) ? authorsData.length : 1} authors to seed`);

    // Function to transform a single author
    const transformAuthor = (author: any) => ({
      id: author.id,
      name: author.name,
      language: author.language || 'en',
      isApproved: Boolean(author.is_approved),
      translatedLanguages: author.translated_languages || ['en'],
      slug: author.slug,
      bio: author.bio || null,
      quote: author.quote || null,
      productsCount: author.products_count || 0,
      born: author.born ? new Date(author.born) : null,
      death: author.death ? new Date(author.death) : null,
      languages: author.languages || null,
      socials: author.socials || [],
      image: author.image || null,
      coverImage: author.cover_image || null
    });

    // Process each author
    const authors = Array.isArray(authorsData) ? authorsData : [authorsData];
    
    for (const author of authors) {
      try {
        const transformedData = transformAuthor(author);
        
        await prisma.author.upsert({
          where: { 
            id: author.id 
          },
          update: transformedData,
          create: transformedData
        });
        
        console.log(`✅ Seeded author: ${author.name}`);
      } catch (error) {
        console.error(`❌ Error seeding author ${author.name}:`, error);
      }
    }

    console.log('✅ Authors seeding completed');
  } catch (error) {
    console.error('❌ Error seeding authors:', error);
    throw error;
  }
}