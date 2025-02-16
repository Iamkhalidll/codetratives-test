import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypesDto } from './dto/get-types.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TypesService {
  constructor(private prisma: PrismaService) {}

  async getTypes({ text, search }: GetTypesDto) {
    let where: Prisma.TypeWhereInput = {};
    
    if (text) {
      where.OR = [
        { name: { contains: text, mode: 'insensitive' } },
        { slug: { contains: text, mode: 'insensitive' } }
      ];
    }

    if (search) {
      const searchParams = search.split(';');
      for (const param of searchParams) {
        const [key, value] = param.split(':');
        if (key !== 'slug') {
          where[key] = { contains: value, mode: 'insensitive' };
        }
      }
    }

    let data = await this.prisma.type.findMany({
      where,
      include: {
        products: true
      }
    });
    return data;
  }

  async getTypeBySlug(slug: string) {
    return this.prisma.type.findUnique({
      where: { slug },
      include: {
        products: true
      }
    });
  }

  async create(createTypeDto: CreateTypeDto) {
    const {
      translated_languages,
      promotional_sliders,
      ...rest
    } = createTypeDto;

    return this.prisma.type.create({
      data: {
        ...rest,
        translated_languages: translated_languages || ['en'],  // Map to camelCase
        promotional_sliders: promotional_sliders || [],        // Map to camelCase
        language: rest.language || 'en'
      }
    });
  }

  async findOne(id: number) {
    return this.prisma.type.findUnique({
      where: { id }
    });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    const {
      translated_languages,
      promotional_sliders,
      ...rest
    } = updateTypeDto;

    return this.prisma.type.update({
      where: { id },
      data: {
        ...rest,
        ...(translated_languages && { translatedLanguages: translated_languages }),
        ...(promotional_sliders && { promotionalSliders: promotional_sliders })
      }
    });
  }

  async remove(id: number) {
    return await this.prisma.type.delete({
      where: { id }
    });
  }
}