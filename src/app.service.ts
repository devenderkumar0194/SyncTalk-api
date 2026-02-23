import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from './database/database.service';
import { UserRole } from './database/schemas/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AppService {
  constructor(
    private readonly Model: DatabaseService,
  ) {
    this.create_super_admin();
  }

  getHello(): string {
    return 'Welcome To Municipal Corporation!';
  }

  async create_super_admin() {
    const email = process.env.SUPER_ADMIN || 'admin@gmail.com';
    const admin: any = await this.Model.UserModel.findOne({ super_admin: true });

    if (!admin) {
      const default_password = 'Admin@#123';
      const password = await bcrypt.hash(default_password, 10);
      const saveData = {
        first_name: "Super",
        last_name: "Admin",
        full_name: 'Super Admin',
        profile_pic: null,
        email: email,
        password: password,
        role: UserRole.SUPER_ADMIN,
        super_admin: true,
      };
      await this.Model.UserModel.create(saveData);
      Logger.log(`Super admin created successfully 🚀 :${email}`)
    }
    Logger.log(`Super admin already created!`)
  }
}
