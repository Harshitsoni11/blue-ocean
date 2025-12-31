import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoryModule } from './category/category.module';
import { SubcategoryModule } from './subcategory/subcategory.module';
import { CourseModule } from './course/course.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI || "mongodb://localhost:27017/db", {
      connectionFactory: (connection) => {
        console.log('MongoDB connected successfully');
        return connection;
      },
    }),
    CategoryModule,
    SubcategoryModule,
    CourseModule
  ],
})
export class AppModule {}
