import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { CommonModule } from 'src/common/common.module';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule, CommonModule],
  controllers: [ProductController],
  providers: [ProductService]
})
export class ProductModule {}
