import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Patch,
    Post,
    Query,
  } from '@nestjs/common';
  
  import { CourseService } from './course.service';
  import { CreateCourseDto } from './dto/create-course.dto';
  import { UpdateCourseDto } from './dto/update-course.dto';
  
  @Controller('courses')
  export class CourseController {
    constructor(private readonly service: CourseService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED) 
    create(@Body() dto: CreateCourseDto) {
      return this.service.create(dto);
    }
  
    @Get()
    @HttpCode(HttpStatus.OK) 
    findAll(@Query() query) {
      return this.service.findAll(query);
    }
  
    @Get(':id')
    @HttpCode(HttpStatus.OK) 
    findOne(@Param('id') id: string) {
      return this.service.findOne(id);
    }
  
    @Patch(':id')
    @HttpCode(HttpStatus.OK) 
    update(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
      return this.service.update(id, dto);
    }
  
    @Delete(':id')
    @HttpCode(HttpStatus.OK) 
    remove(@Param('id') id: string) {
      return this.service.remove(id);
    }
  }
  