import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadsModule } from './uploads/uploads.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [UploadsModule, AdminModule, DatabaseModule, CommonModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
