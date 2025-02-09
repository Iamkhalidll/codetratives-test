export class GetProductsDto {
  limit?: number;
  page?: number;
  search?: string;
}

export class GetPopularProductsDto {
  limit?: number;
  type_slug?: string;
}

export class GetBestSellingProductsDto {
  limit?: number;
  type_slug?: string;
}

export interface ProductPaginator {
  data: any[];
  count: number;
  currentPage: number;
  firstItem: number;
  lastItem: number;
  lastPage: number;
  perPage: number;
  total: number;
}