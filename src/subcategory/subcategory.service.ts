import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { SubCategory } from './schemas/subcategory.schema';
import { Category } from '../category/schemas/category.schema';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubCategoryDto } from './dto/update-subcategory.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectModel(SubCategory.name) private subModel: Model<SubCategory>,
    @InjectModel(Category.name) private catModel: Model<Category>,
  ) {}

  async create(dto: CreateSubCategoryDto) {
    const category = await this.catModel.findOne({
      _id: dto.categoryId,
      isDeleted: false,
    });

    if (!category) {
      throw new BadRequestException('Invalid Category');
    }

    return this.subModel.create({
      name: dto.name,
      categoryId: new Types.ObjectId(dto.categoryId),
    });
  }

  findAll(query: PaginationQueryDto) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const sort = query.sort === 'ASC' ? 1 : -1;

    const filter: any = { isDeleted: false };

    if (query.search) {
      filter.name = { $regex: query.search, $options: 'i' };
    }

    return this.subModel
      .find(filter)
      .sort({ name: sort })
      .skip((page - 1) * limit)
      .limit(limit);
  }

  async findOne(id: string) {
    const sub = await this.subModel.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!sub) {
      throw new NotFoundException({
        success: false,
        message: 'SubCategory not found',
      });
    }

    return sub;
  }

  async update(id: string, dto:UpdateSubCategoryDto) {
    const sub = await this.subModel.findById(id);

    if (!sub || sub.isDeleted) {
      throw new NotFoundException({
        success: false,
        message: 'SubCategory not found',
      });
    }

    if (dto.categoryId) {
      const category = await this.catModel.findOne({
        _id: dto.categoryId,
        isDeleted: false,
      });

      if (!category) {
        throw new BadRequestException({
          success: false,
          message: 'Invalid Category',
        });
      }
    }

    return this.subModel.findByIdAndUpdate(id, {
      name: dto.name,
      categoryId: new Types.ObjectId(dto.categoryId),
    }, {
      new: true,
    });
  }

  async remove(id: string) {
    const sub = await this.subModel.findById(id);

    if (!sub) {
      throw new NotFoundException({
        success: false,
        message: 'SubCategory not found',
      });
    }

    return this.subModel.findByIdAndUpdate(id, {
      isDeleted: true,
    });
  }
}
