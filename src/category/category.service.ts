import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';
import {PaginationQueryDto} from '../common/dto/pagination-query.dto'
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  create(dto: any) {
    return this.categoryModel.create(dto);
  }

  findAll(query : PaginationQueryDto) {
    const { page = 1, limit = 10, search, sort = 'DESC' } = query;
    console.log(typeof query);
    
    const filter: any = { isDeleted: false };
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let res = this.categoryModel
    .find(filter)
    .sort({ name: sort === 'ASC' ? 1 : -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));
    return res;
  }

  findOne(id: string) {
    return this.categoryModel.findOne({ _id: id, isDeleted: false });
  }

  update(id: string, dto: UpdateCategoryDto) {
    return this.categoryModel.findByIdAndUpdate(id, dto, { new: true });
  }

  remove(id: string) {
    return this.categoryModel.findByIdAndUpdate(id, { isDeleted: true },{new: true});
  }

  // Aggregation
  async categoryWithSubCount() {

    let res =  this.categoryModel.aggregate([
      {
        $match: { isDeleted: false },
      },
      {
        $lookup: {
          from: 'subcategories',
          localField: '_id',
          foreignField: 'categoryId',
          as: 'subCategories',
        },
      },
      {
        $project: {
          name: 1,
          subCategoryCount: {
            $size: {
              $filter: {
                input: '$subCategories',
                as: 'sub',
                cond: { $eq: ['$$sub.isDeleted', false] },
              },
            },
          },
        },
      },
    ]);
      
    return res;
  }
}
