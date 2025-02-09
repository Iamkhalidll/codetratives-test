
// src/prisma/seeds/shop.seed.ts
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

export async function seedShops(prisma: PrismaClient) {
  try {
    // Read and parse the JSON file
    const rawData = fs.readFileSync(
      path.join(__dirname, '../../db/pickbazar/shops.json'),
      'utf-8'
    );
    
    const shopsData = JSON.parse(rawData);
    console.log('Loaded shops data:', Array.isArray(shopsData) ? shopsData.length : 1, 'shops');

    // Convert to array if single object
    const shops = Array.isArray(shopsData) ? shopsData : [shopsData];

    for (const shop of shops) {
      console.log('Processing shop:', shop.name);

      try {
        // First, ensure the owner exists and create/update profile
        const owner = await prisma.user.upsert({
          where: {
            id: shop.owner.id
          },
          update: {
            name: shop.owner.name,
            email: shop.owner.email,
            is_active: Boolean(shop.owner.is_active),
            profile: {
              upsert: {
                create: {
                  bio: shop.owner.profile.bio,
                  contact: shop.owner.profile.contact,
                  avatarId: shop.owner.profile.avatar?.id,
                  avatarOriginal: shop.owner.profile.avatar?.original,
                  avatarThumbnail: shop.owner.profile.avatar?.thumbnail,
                },
                update: {
                  bio: shop.owner.profile.bio,
                  contact: shop.owner.profile.contact,
                  avatarId: shop.owner.profile.avatar?.id,
                  avatarOriginal: shop.owner.profile.avatar?.original,
                  avatarThumbnail: shop.owner.profile.avatar?.thumbnail,
                }
              }
            }
          },
          create: {
            id: shop.owner.id,
            name: shop.owner.name,
            email: shop.owner.email,
            password: 'hashed_password_here', // You should provide a proper hashed password
            is_active: Boolean(shop.owner.is_active),
            profile: {
              create: {
                bio: shop.owner.profile.bio,
                contact: shop.owner.profile.contact,
                avatarId: shop.owner.profile.avatar?.id,
                avatarOriginal: shop.owner.profile.avatar?.original,
                avatarThumbnail: shop.owner.profile.avatar?.thumbnail,
              }
            }
          }
        });

        // Then create/update the shop
        const createdShop = await prisma.shop.upsert({
          where: {
            id: shop.id
          },
          update: {
            name: shop.name,
            slug: shop.slug,
            description: shop.description,
            coverImage: shop.cover_image,
            logo: shop.logo,
            isActive: Boolean(shop.is_active),
            address: shop.address,
            settings: shop.settings,
            ownerId: owner.id
          },
          create: {
            id: shop.id,
            name: shop.name,
            slug: shop.slug,
            description: shop.description,
            coverImage: shop.cover_image,
            logo: shop.logo,
            isActive: Boolean(shop.is_active),
            address: shop.address,
            settings: shop.settings,
            ownerId: owner.id
          }
        });

        console.log(`✅ Successfully seeded shop: ${createdShop.name}`);
      } catch (error) {
        console.error(`❌ Error seeding shop ${shop.name}:`, error);
      }
    }

    console.log('✅ All shops seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding shops:', error);
    throw error;
  }
}