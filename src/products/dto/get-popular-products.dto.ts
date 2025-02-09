import { IsOptional, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class GetPopularProductsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @IsString()
  type_slug?: string;

  @IsOptional()
  @IsString()
  shop_id?: string;
}