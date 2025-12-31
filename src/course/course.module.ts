import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Course, CourseSchema } from './schemas/course.schema';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import {
  SubCategory,
  SubCategorySchema,
} from '../subcategory/schemas/subcategory.schema';

import { CourseService } from './course.service';
import { CourseController } from './course.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: Category.name, schema: CategorySchema },
      { name: SubCategory.name, schema: SubCategorySchema },
    ]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
