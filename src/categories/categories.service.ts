// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { GetCategoriesDto } from './dto/get-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { paginate } from 'src/common/pagination/paginate';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async getCategories({ limit = 15, page = 1, search, parent }: GetCategoriesDto) {
    const where = {};

    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        where[key] = {
          contains: value,
          mode: 'insensitive',
        };
      }
    }

    if (parent === 'null') {
      where['parentId'] = null;
    }

    const totalItems = await this.prisma.category.count({ where });
    const categories = await this.prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        parent: true,
        children: true,
      },
    });

    const url = `/categories?search=${search}&limit=${limit}&parent=${parent}`;
    return {
      data: categories,
      ...paginate(totalItems, page, limit, categories.length, url),
    };
  }

  async getCategory(param: string) {
    const where = isNaN(Number(param))
      ? { slug: param }
      : { id: Number(param) };

    return this.prisma.category.findUnique({
      where,
      include: {
        parent: true,
        children: true,
      },
    });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  async remove(id: number) {
    return this.prisma.category.delete({
      where: { id },
    });
  }
}