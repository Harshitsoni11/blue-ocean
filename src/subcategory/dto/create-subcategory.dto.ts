import { IsMongoId, IsString } from 'class-validator';

export class CreateSubCategoryDto {
  @IsString()
  name: string;

  @IsMongoId()
  categoryId: string;
}
