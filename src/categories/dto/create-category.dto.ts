// src/categories/dto/create-category.dto.ts
import { IsString, IsOptional, IsNumber, IsObject } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  icon?: string;

  @IsObject()
  @IsOptional()
  image?: Record<string, any>;

  @IsString()
  @IsOptional()
  details?: string;

  @IsNumber()
  @IsOptional()
  parentId?: number;
}