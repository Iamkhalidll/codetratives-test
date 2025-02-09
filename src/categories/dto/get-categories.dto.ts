// src/categories/dto/get-categories.dto.ts
import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetCategoriesDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 15;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  parent?: string;
}