export class CreateProductDto {
  name: string;
  slug: string;
  description?: string;
  type_id?: number;
  shop_id: number;
  price?: number;
  sale_price?: number;
  min_price?: number;
  max_price?: number;
  sku?: string;
  quantity?: number;
  in_stock?: boolean;
  status?: string;
  product_type?: string;
  unit?: string;
  image?: any;
  gallery?: any[];
}