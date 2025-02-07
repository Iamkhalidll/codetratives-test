import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Read JSON files
    const attributes = JSON.parse(fs.readFileSync('./attributes.json', 'utf-8'));
    const authors = JSON.parse(fs.readFileSync('./authors.json', 'utf-8'));
    const categories = JSON.parse(fs.readFileSync('./categories.json', 'utf-8'));
    const coupons = JSON.parse(fs.readFileSync('./coupons.json', 'utf-8'));
    const orderFiles = JSON.parse(fs.readFileSync('./order-files.json', 'utf-8'));
    const orders = JSON.parse(fs.readFileSync('./orders.json', 'utf-8'));
    const orderStatuses = JSON.parse(fs.readFileSync('./order-statuses.json', 'utf-8'));
    const products = JSON.parse(fs.readFileSync('./products.json', 'utf-8'));
    const shops = JSON.parse(fs.readFileSync('./shops.json', 'utf-8'));
    const users = JSON.parse(fs.readFileSync('./users.json', 'utf-8'));

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.$transaction([
      prisma.attributeValue.deleteMany(),
      prisma.attribute.deleteMany(),
      prisma.author.deleteMany(),
      prisma.category.deleteMany(),
      prisma.coupon.deleteMany(),
      prisma.orderFile.deleteMany(),
      prisma.order.deleteMany(),
      prisma.orderStatus.deleteMany(),
      prisma.product.deleteMany(),
      prisma.shop.deleteMany(),
      prisma.user.deleteMany(),
    ]);

    // Import attributes and their values
    console.log('Importing attributes...');
    for (const attr of attributes) {
      await prisma.attribute.create({
        data: {
          id: attr.id,
          name: attr.name,
          slug: attr.slug,
          values: {
            create: attr.values.map((v: any) => ({
              id: v.id,
              value: v.value
            }))
          }
        }
      });
    }

    // Import authors
    console.log('Importing authors...');
    for (const author of authors) {
      await prisma.author.create({
        data: {
          id: author.id,
          name: author.name,
          isApproved: author.is_approved === 1,
          image: author.image,
          coverImage: author.cover_image,
          slug: author.slug,
          language: author.language,
          bio: author.bio,
          quote: author.quote,
          born: author.born ? new Date(author.born) : null,
          death: author.death ? new Date(author.death) : null,
          languages: author.languages,
          socials: author.socials,
          productsCount: author.products_count,
          translatedLanguages: author.translated_languages,
          createdAt: new Date(author.created_at),
          updatedAt: new Date(author.updated_at)
        }
      });
    }

    // Import categories
    console.log('Importing categories...');
    // First pass: Create all categories without relationships
    for (const category of categories) {
      await prisma.category.create({
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          image: category.image,
          icon: category.icon
        }
      });
    }
    
    // Second pass: Update parent-child relationships
    for (const category of categories) {
      if (category.children && category.children.length > 0) {
        for (const child of category.children) {
          await prisma.category.update({
            where: { id: child.id },
            data: { parentId: category.id }
          });
        }
      }
    }

    // Import coupons
    console.log('Importing coupons...');
    for (const coupon of coupons) {
      await prisma.coupon.create({
        data: {
          id: coupon.id,
          code: coupon.code,
          language: coupon.language,
          description: coupon.description,
          image: coupon.image,
          type: coupon.type,
          amount: coupon.amount,
          activeFrom: new Date(coupon.active_from),
          expireAt: new Date(coupon.expire_at),
          isValid: coupon.is_valid,
          translatedLanguages: coupon.translated_languages,
          createdAt: new Date(coupon.created_at),
          updatedAt: new Date(coupon.updated_at)
        }
      });
    }

    // Import order files
    console.log('Importing order files...');
    for (const orderFile of orderFiles) {
      await prisma.orderFile.create({
        data: {
          id: orderFile.id,
          purchaseKey: orderFile.purchase_key,
          digitalFileId: orderFile.digital_file_id,
          orderId: orderFile.order_id,
          customerId: orderFile.customer_id,
          file: orderFile.file,
          createdAt: new Date(orderFile.created_at),
          updatedAt: new Date(orderFile.updated_at)
        }
      });
    }

    // Import orders
    console.log('Importing orders...');
    for (const order of orders) {
      await prisma.order.create({
        data: {
          id: order.id,
          trackingNumber: order.tracking_number,
          amount: order.amount,
          total: order.total,
          deliveryFee: order.delivery_fee,
          discount: order.discount,
          status: order.status,
          deliveryTime: order.delivery_time,
          products: order.products,
          shippingAddress: order.shipping_address,
          createdAt: new Date(order.created_at)
        }
      });
    }

    // Import order statuses
    console.log('Importing order statuses...');
    for (const status of orderStatuses) {
      await prisma.orderStatus.create({
        data: {
          id: status.id,
          name: status.name,
          serial: status.serial,
          color: status.color,
          createdAt: new Date(status.created_at),
          updatedAt: new Date(status.updated_at)
        }
      });
    }

    // Import products
    console.log('Importing products...');
    for (const product of products) {
      await prisma.product.create({
        data: {
          id: parseInt(product.id.replace('product', '')),
          name: product.name,
          slug: product.slug,
          description: product.description,
          image: product.image,
          gallery: product.gallery,
          quantity: product.quantity,
          price: product.price,
          salePrice: product.sale_price,
          unit: product.unit,
          productType: product.product_type,
          maxPrice: product.max_price,
          minPrice: product.min_price,
          tags: product.tag,
          variations: product.variations || [],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    // Import shops
    console.log('Importing shops...');
    for (const shop of shops) {
      await prisma.shop.create({
        data: {
          id: shop.id,
          ownerId: shop.owner_id,
          name: shop.name,
          slug: shop.slug,
          description: shop.description,
          coverImage: shop.cover_image,
          logo: shop.logo,
          isActive: shop.is_active === 1,
          address: shop.address,
          settings: shop.settings,
          createdAt: new Date(shop.created_at),
          updatedAt: new Date(shop.updated_at)
        }
      });
    }

    // Import users
    console.log('Importing users...');
    for (const user of users) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerifiedAt: user.email_verified_at ? new Date(user.email_verified_at) : null,
          isActive: user.is_active === 1,
          shopId: user.shop_id,
          profile: user.profile,
          address: user.address,
          permissions: user.permissions,
          createdAt: new Date(user.created_at),
          updatedAt: new Date(user.updated_at)
        }
      });
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during import:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });