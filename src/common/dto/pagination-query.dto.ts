import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  sort?: 'ASC' | 'DESC';
}
