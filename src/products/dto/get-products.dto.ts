import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString } from 'class-validator';

export class GetProductsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;
}

export class GetPopularProductsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  type_slug?: string;
}

export class GetBestSellingProductsDto {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  type_slug?: string;
}

export class ProductPaginator {
  @Type(() => Array)
  data: any[];

  @IsInt()
  @IsPositive()
  count: number;

  @IsInt()
  @IsPositive()
  currentPage: number;

  @IsInt()
  @IsPositive()
  firstItem: number;

  @IsInt()
  @IsPositive()
  lastItem: number;

  @IsInt()
  @IsPositive()
  lastPage: number;

  @IsInt()
  @IsPositive()
  perPage: number;

  @IsInt()
  @IsPositive()
  total: number;
}