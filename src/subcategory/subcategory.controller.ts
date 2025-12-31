import { Controller, Post, Body, Get, Delete, Param, HttpStatus, HttpCode, Query, Patch } from '@nestjs/common';
import { SubcategoryService } from './subcategory.service';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';

@Controller('subcategories')
export class SubcategoryController {
  constructor(private readonly service: SubcategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateSubCategoryDto) {
    return this.service.create(dto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateSubCategoryDto,
  ) {
    return this.service.update(id, dto);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
