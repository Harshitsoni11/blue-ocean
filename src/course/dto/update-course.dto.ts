import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class UpdateCourseDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  categoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  subCategoryIds?: string[];
}
