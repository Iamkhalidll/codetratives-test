// prisma/seeds/index.ts
import { PrismaClient } from '@prisma/client';
import { seedProducts } from './product.seed';
import { seedAnalytics } from './analytics.seed';
import { seedAuthors } from './authors.seed';
import { seedAttributes } from './attributes.seed';
import { seedShops } from './shop.seed';
import { seedCategories } from './category.seed';
import { seedTypes } from './types.seed';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🌱 Starting database seeding...');
    await seedProducts(prisma);    
    // await seedAnalytics(prisma);
    // await seedAuthors(prisma);
    // await seedAttributes(prisma);
    // await seedCategories(prisma);
    // await seedTypes(prisma);
    // await seedShops(prisma);
    console.log('✅ Database seeding completed');
  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });