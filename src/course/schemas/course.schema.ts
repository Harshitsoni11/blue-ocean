import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop([{ type: Types.ObjectId, ref: 'Category' }])
  categoryIds: Types.ObjectId[];

  @Prop([{ type: Types.ObjectId, ref: 'SubCategory' }])
  subCategoryIds: Types.ObjectId[];

  @Prop({ default: false })
  isDeleted: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
