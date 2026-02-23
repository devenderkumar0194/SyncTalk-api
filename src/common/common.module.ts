import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { config } from 'dotenv';
import { CommonService } from './common.service';
config();

const jwt_secret = process.env.JWT_SECRET || "devlopment";

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwt_secret,
    }),
    ConfigModule],
  providers: [CommonService],
  exports: [CommonService]
})
export class CommonModule {}
