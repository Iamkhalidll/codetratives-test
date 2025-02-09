import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { TypesService } from './types.service';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { GetTypesDto } from './dto/get-types.dto';

@Controller('types')
export class TypesController {
  constructor(private readonly typesService: TypesService) {}

  @Get()
  getTypes(@Query() query: GetTypesDto) {
    return this.typesService.getTypes(query);
  }

  @Get(':slug')
  getTypeBySlug(@Param('slug') slug: string) {
    return this.typesService.getTypeBySlug(slug);
  }

  @Post()
  create(@Body() createTypeDto: CreateTypeDto) {
    return this.typesService.create(createTypeDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTypeDto: UpdateTypeDto) {
    return this.typesService.update(+id, updateTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typesService.remove(+id);
  }
}