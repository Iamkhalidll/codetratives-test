import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto, ProductPaginator, GetPopularProductsDto, GetBestSellingProductsDto } from './dto/get-products.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const {
        type_id,
        shop_id,
        sale_price,
        min_price,
        max_price,
        in_stock,
        product_type,
        ...rest
      } = createProductDto;

      const data: Prisma.ProductCreateInput = {
        ...rest,
        shop: {
          connect: { id: shop_id }
        },
        ...(type_id && {
          type: {
            connect: { id: type_id }
          }
        }),
        price: new Prisma.Decimal(createProductDto.price || 0),
        sale_price: sale_price ? new Prisma.Decimal(sale_price) : null,
        min_price: min_price ? new Prisma.Decimal(min_price) : null,
        max_price: max_price ? new Prisma.Decimal(max_price) : null,
        in_stock: in_stock,
        product_type: product_type,
      };

      return await this.prisma.product.create({
        data,
        include: {
          type: true,
          shop: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('A product with this slug already exists');
        }
        if (error.code === 'P2003') {
          throw new Error('Referenced shop or type does not exist');
        }
      }
      throw error;
    }
  }
  async getProducts({ limit = 30, page = 1, search }: GetProductsDto): Promise<ProductPaginator> {
    const skip = (page - 1) * limit;
    
    let where: Prisma.ProductWhereInput = {};
    
    if (search) {
      const searchParams = search.split(';');
      for (const param of searchParams) {
        const [key, value] = param.split(':');
        
        switch (key) {
          case 'shop_id':
            where.shop_id = parseInt(value, 10);
            break;
          case 'name':
            where.name = { contains: value, mode: 'insensitive' };
            break;
          case 'status':
            where.status = value;
            break;
        }
      }
    }

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        type: true,
        shop: true,
      },
    });

    return {
      data: products,
      count: products.length,
      currentPage: page,
      firstItem: skip + 1,
      lastItem: skip + products.length,
      lastPage: Math.ceil(total / limit),
      perPage: limit,
      total,
    };
  }

  async getProductBySlug(slug: string) {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        type: true,
        shop: true,
      },
    });

    if (!product) return null;

    const relatedProducts = await this.prisma.product.findMany({
      where: {
        type_id: product.type_id,
        NOT: { id: product.id },
      },
      take: 20,
      include: {
        type: true,
        shop: true,
      },
    });

    return {
      ...product,
      related_products: relatedProducts,
    };
  }

  async getPopularProducts({ limit = 10, type_slug }: GetPopularProductsDto) {
    return this.prisma.product.findMany({
      where: type_slug ? {
        type: { slug: type_slug }
      } : undefined,
      take: limit,
      orderBy: { ratings: 'desc' },
      include: {
        type: true,
        shop: true,
      },
    });
  }

  async getBestSellingProducts({ limit = 10, type_slug }: GetBestSellingProductsDto) {
    return this.prisma.product.findMany({
      where: type_slug ? {
        type: { slug: type_slug }
      } : undefined,
      take: limit,
      orderBy: { sold_quantity: 'desc' },
      include: {
        type: true,
        shop: true,
      },
    });
  }

  async getProductsStock({ limit = 30, page = 1, search }: GetProductsDto): Promise<ProductPaginator> {
    const skip = (page - 1) * limit;
    
    let where: Prisma.ProductWhereInput = {
      quantity: { lte: 9 }
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        type: true,
        shop: true,
      },
    });

    return {
      data: products,
      count: products.length,
      currentPage: page,
      firstItem: skip + 1,
      lastItem: skip + products.length,
      lastPage: Math.ceil(total / limit),
      perPage: limit,
      total,
    };
  }

  async getDraftProducts({ limit = 30, page = 1, search }: GetProductsDto): Promise<ProductPaginator> {
    const skip = (page - 1) * limit;
    
    let where: Prisma.ProductWhereInput = {
      status: 'draft'
    };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const total = await this.prisma.product.count({ where });
    const products = await this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        type: true,
        shop: true,
      },
    });

    return {
      data: products,
      count: products.length,
      currentPage: page,
      firstItem: skip + 1,
      lastItem: skip + products.length,
      lastPage: Math.ceil(total / limit),
      perPage: limit,
      total,
    };
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        type: true,
        shop: true,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }
}