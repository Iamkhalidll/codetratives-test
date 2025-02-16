import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsUrl,
  IsDecimal,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ImageDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;
}

export class VideoDto {
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;
}

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  type_id?: number;

  @IsDecimal()
  @IsNotEmpty()
  price: string; // Decimal values are represented as strings in DTOs

  @IsNumber()
  @IsNotEmpty()
  shop_id: number;

  @IsDecimal()
  @IsOptional()
  sale_price?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsDecimal()
  @IsNotEmpty()
  min_price: string;

  @IsDecimal()
  @IsNotEmpty()
  max_price: string;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @IsOptional()
  sold_quantity?: number;

  @IsBoolean()
  @IsOptional()
  in_stock?: boolean;

  @IsBoolean()
  @IsOptional()
  is_taxable?: boolean;

  @IsBoolean()
  @IsOptional()
  in_flash_sale?: boolean;

  @IsNumber()
  @IsOptional()
  shipping_class_id?: number;

  @IsString()
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  product_type?: string;

  @IsString()
  @IsOptional()
  unit?: string;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @ValidateNested()
  @Type(() => ImageDto)
  @IsOptional()
  image?: ImageDto;

  @ValidateNested()
  @Type(() => VideoDto)
  @IsOptional()
  video?: VideoDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageDto)
  @IsOptional()
  gallery?: ImageDto[];

  @IsDateString()
  @IsOptional()
  deleted_at?: string;

  @IsNumber()
  @IsOptional()
  author_id?: number;

  @IsNumber()
  @IsOptional()
  manufacturer_id?: number;

  @IsBoolean()
  @IsOptional()
  is_digital?: boolean;

  @IsBoolean()
  @IsOptional()
  is_external?: boolean;

  @IsString()
  @IsOptional()
  external_product_url?: string;

  @IsString()
  @IsOptional()
  external_product_button_text?: string;

  @IsArray()
  @IsOptional()
  blocked_dates?: string[];

  @IsNumber()
  @IsOptional()
  orders_count?: number;

  @IsNumber()
  @IsOptional()
  ratings?: number;

  @IsNumber()
  @IsOptional()
  total_reviews?: number;

  @IsArray()
  @IsOptional()
  rating_count?: number[];

  @IsArray()
  @IsOptional()
  translated_languages?: string[];

  @IsNumber()
  @IsOptional()
  categoryId?: number;
}