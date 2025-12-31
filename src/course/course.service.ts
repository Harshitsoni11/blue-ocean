import {
    BadRequestException,
    Injectable,
    NotFoundException,
  } from '@nestjs/common';
  import { InjectModel, InjectConnection } from '@nestjs/mongoose';
  import { Model, Connection, Types } from 'mongoose';
  
  import { Course } from './schemas/course.schema';
  import { Category } from '../category/schemas/category.schema';
  import { SubCategory } from '../subcategory/schemas/subcategory.schema';
import { CreateCourseDto } from './dto/create-course.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
  
  @Injectable()
  export class CourseService {
    constructor(
      @InjectModel(Course.name)
      private courseModel: Model<Course>,
  
      @InjectModel(Category.name)
      private categoryModel: Model<Category>,
  
      @InjectModel(SubCategory.name)
      private subCategoryModel: Model<SubCategory>,
  
      @InjectConnection()
      private connection: Connection,
    ) {}
  
    // 🔥 CREATE COURSE WITH VALIDATION + TRANSACTION
    async create(dto : CreateCourseDto) {
      // const session = await this.connection.startSession();
      // session.startTransaction();
  
      try {
        
        const categories = await this.categoryModel.find({
          _id: { $in: dto.categoryIds.map((id) => new Types.ObjectId(id)) },
          isDeleted: false,
        });
  
        if (categories.length !== dto.categoryIds.length) {
          throw new BadRequestException({
            success: false,
            message: 'Invalid Category selected',
          });
        }
  
        
        const subCategories = await this.subCategoryModel.find({
          _id: { $in: dto.subCategoryIds.map((id) => new Types.ObjectId(id)) },
          isDeleted: false,
        });
        
  
        if (subCategories.length !== dto.subCategoryIds.length) {
          
          throw new BadRequestException({
            success: false,
            message: 'Invalid SubCategory selected',
          });
        }
  
       
        const categoryIds = dto.categoryIds.map(String);
  
        const isValid = subCategories.every(sub =>
          categoryIds.includes(sub.categoryId.toString()),
        );
        
        if (!isValid) {
          throw new BadRequestException({
            success: false,
            message:
              'SubCategories must belong to selected Categories',
          });
        }
  
        const course = await this.courseModel.create(
            {
              title: dto.title,
              categoryIds: dto.categoryIds.map(id => new Types.ObjectId(id)),
              subCategoryIds: dto.subCategoryIds.map(id => new Types.ObjectId(id)),
            },
          
          // { session },
        );
        // await session.commitTransaction();
        return course;
      } catch (error) {
        // await session.abortTransaction();
        throw error;
      } finally {
        // session.endSession();
      }
    }
  
   
    async findAll(query : PaginationQueryDto) {
      const {
        page = 1,
        limit = 10,
        search,
        sort = 'DESC',
      } = query;
  
      const filter: any = { isDeleted: false };
     
      
      if (search) {
        filter.title = { $regex: search, $options: 'i' };
      }
  
      return this.courseModel
        .find(filter)
        .populate('categoryIds')
        .populate('subCategoryIds')
        .sort({ createdAt: sort === 'ASC' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
    }
  
    
    async findOne(id: string) {
      const course = await this.courseModel
        .findOne({ _id: id, isDeleted: false })
        .populate('categoryIds')
        .populate('subCategoryIds');
  
      if (!course) {
        throw new NotFoundException('Course not found');
      }
  
      return course;
    }
  

    async update(id: string, dto: UpdateCourseDto) {
      const course = await this.courseModel.findById(id);
    
      if (!course || course.isDeleted) {
        throw new NotFoundException('Course not found');
      }
    
      const categoryObjectIds = dto.categoryIds
        ? dto.categoryIds.map(id => new Types.ObjectId(id))
        : course.categoryIds;
    
      const subCategoryObjectIds = dto.subCategoryIds
        ? dto.subCategoryIds.map(id => new Types.ObjectId(id))
        : course.subCategoryIds;
    
    
      if (dto.categoryIds) {
        const categories = await this.categoryModel.find({
          _id: { $in: categoryObjectIds },
          isDeleted: false,
        });
    
        if (categories.length !== categoryObjectIds.length) {
          throw new BadRequestException('Invalid Category selected');
        }
      }
    
  
      if (dto.subCategoryIds) {
        const subCategories = await this.subCategoryModel.find({
          _id: { $in: subCategoryObjectIds },
          isDeleted: false,
        });
    
        if (subCategories.length !== subCategoryObjectIds.length) {
          throw new BadRequestException('Invalid SubCategory selected');
        }
    
    
        const selectedCategoryIds = categoryObjectIds.map(id =>
          id.toString(),
        );
    
        const isValid = subCategories.every(sub =>
          selectedCategoryIds.includes(sub.categoryId.toString()),
        );
    
        if (!isValid) {
          throw new BadRequestException(
            'SubCategories must belong to selected Categories',
          );
        }
      }
    

      return this.courseModel.findByIdAndUpdate(
        id,
        {
          ...dto,
          categoryIds: categoryObjectIds,
          subCategoryIds: subCategoryObjectIds,
        },
        { new: true },
      );
    }
  
    // 🗑 SOFT DELETE
    async remove(id: string) {
      const course = await this.courseModel.findById(id);
  
      if (!course) {
        throw new NotFoundException('Course not found');
      }
  
      return this.courseModel.findByIdAndUpdate(id, { isDeleted: true });
    }
  }
  