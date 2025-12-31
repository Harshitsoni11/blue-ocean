import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateSubCategoryDto {
  @IsString()
  name?: string;
  
  @IsMongoId()
  categoryId?: string;
}
