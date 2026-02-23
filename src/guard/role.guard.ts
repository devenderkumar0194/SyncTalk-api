import {
  CanActivate,
  ExecutionContext,
  Injectable,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from 'src/database/database.service';
import { config } from 'dotenv';
import { Types } from 'mongoose';
import { ROLES_KEY } from './decorators/role.decorators';
import { UserRole } from 'src/database/schemas/user.schema';
config();

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly databaseService: DatabaseService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user_id = request.user?._id;

    if (!user_id) {
      throw new HttpException(
        {
          error_description: 'Unauthorized request',
          error_code: 'UNAUTHORIZED',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const user: any = await this.databaseService.UserModel.findOne({
        _id: new Types.ObjectId(user_id),
      }, { _id: 1, email: 1, role: 1 }, { lean: true } );

      if (!user) {
        throw new HttpException(
          {
            error_description: 'User not found',
            error_code: 'USER_NOT_FOUND',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (!roles.includes(user.role)) {
        throw new HttpException(
          {
            error_description: 'You have no permission to access this resource',
            error_code: 'ACCESS_DENIED',
          },
          HttpStatus.UNAUTHORIZED,
        );
      }

      return true;
    } catch (error) {
      console.error('RolesGuard Error:', error);
      throw error
    }
  }
}
