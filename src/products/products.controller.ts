import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { GetProductsDto, GetPopularProductsDto, GetBestSellingProductsDto } from './dto/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
 async getProducts(@Query() query: GetProductsDto) {
    let data = await this.productsService.getProducts(query);
    return data;
  }

  @Get('popular')
  getPopularProducts(@Query() query: GetPopularProductsDto) {
    return this.productsService.getPopularProducts(query);
  }

  @Get('best-selling')
  getBestSellingProducts(@Query() query: GetBestSellingProductsDto) {
    return this.productsService.getBestSellingProducts(query);
  }

  @Get('stock')
  getProductsStock(@Query() query: GetProductsDto) {
    return this.productsService.getProductsStock(query);
  }

  @Get('draft')
  getDraftProducts(@Query() query: GetProductsDto) {
    return this.productsService.getDraftProducts(query);
  }

  @Get(':slug')
  getProductBySlug(@Param('slug') slug: string) {
    return this.productsService.getProductBySlug(slug);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productsService.update(+id, updateProductDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsService.remove(+id);
  }
}