import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import * as Schema from './schemas/index';
import { config } from 'dotenv';
config({ path: '.env' });

const database_url = process.env.MONGODB_URI;


@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: database_url,
      }),
    }),

    MongooseModule.forFeature([
      { name: Schema.User.Users.name, schema: Schema.User.UserSchema },
      { name: Schema.Session.Sessions.name, schema: Schema.Session.SessionSchema },

    ]),
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }
