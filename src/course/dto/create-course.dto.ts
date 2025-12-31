import { IsArray, IsMongoId, IsString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsArray()
  @IsMongoId({ each: true })
  categoryIds: string[];

  @IsArray()
  @IsMongoId({ each: true })
  subCategoryIds: string[];
}
