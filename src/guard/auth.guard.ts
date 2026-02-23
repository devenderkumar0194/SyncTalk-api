import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from 'src/database/database.service';
import { config } from 'dotenv';
import { UserStatus } from 'src/database/schemas/user.schema';
config();

const jwt_secret = process.env.JWT_SECRET || "devlopment";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private Model: DatabaseService,
    private jwtService: JwtService,
    private reflector: Reflector,
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const language = request.headers['language'];

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new HttpException(
        { error_code: 'unauthorized', error_description: 'unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // Check if the token is present in the session table
    const session = await this.Model.SessionModel.findOne({ access_token: token, is_logout: false });
    if (!session) {
      throw new HttpException(
        { error_code: 'unauthorized', error_description: 'unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      const payload = await this.jwtService.verify(token, {
        secret: jwt_secret,
      });
      const { _id: user_id } = payload;
      const user_info = await this.Model.UserModel.findOne(
        { _id: user_id },
        { _id: true, email: true, first_name: true, role: true, full_name: true, status: true },
        { lean: true }
      );

      if (user_info.status === UserStatus.BLOCK) {
        await this.Model.SessionModel.deleteMany({ user: user_id });

        throw new HttpException(
          { error_code: 'unauthorized', error_description: 'Your account has been blocked!' },
          HttpStatus.UNAUTHORIZED,
        );
      }

      request.payload = payload;
      request.user = user_info;
      request.token = token;
    } catch {
      throw new HttpException(
        { error_code: 'unauthorized', error_description: 'unauthorized' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    return true;
  }

  public extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
