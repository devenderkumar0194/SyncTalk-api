import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as Schema from './schemas/index'

@Injectable()
export class DatabaseService {
    constructor(
        @InjectModel(Schema.User.Users.name) public UserModel: Model<Schema.User.Users>,
        @InjectModel(Schema.Session.Sessions.name) public SessionModel: Model<Schema.Session.Sessions>,

    ) { }
}
