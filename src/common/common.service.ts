import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
// import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';
import { DatabaseService } from 'src/database/database.service';
import { config } from 'dotenv';
config();


@Injectable()
export class CommonService {
    private nodemailer_email
    private nodemailer_password
    private server_key: string;
    private server: string;

    constructor(
        private readonly JwtService: JwtService,
        private readonly Model: DatabaseService,
        private readonly ConfigService: ConfigService
    ) {

    }

    async generateToken(token_data: any) {
        try {
            const token = await this.JwtService.signAsync(token_data)
            return token;
        } catch (error) {
            console.error('error', error)
            throw new HttpException('Failed to geerate token', HttpStatus.BAD_REQUEST)
        }
    }

    async decodeToken(token_data: any) {
        try {
            let token = await this.JwtService.verifyAsync(token_data)
            return token;
        } catch (error) {
            throw new HttpException(`Failed to verify token`, HttpStatus.BAD_REQUEST)
        }
    }

    async setOptions(pagination: number, limit: number, sort = -1) {
        try {
            let options: any = {
                lean: true,
                sort: { _id: -1 }
            }

            if (pagination == undefined && limit == undefined) {
                options = {
                    lean: true,
                    sort: { _id: -1 },
                    limit: 10,
                    pagination: 0,
                    skip: 0
                }
            }
            else if (pagination == undefined && typeof limit != undefined) {
                options = {
                    lean: true,
                    sort: { _id: -1 },
                    limit: Number(limit),
                    skip: 0,
                }
            }
            else if (typeof pagination != undefined && limit == undefined) {
                options = {
                    lean: true,
                    sort: { _id: -1 },
                    skip: Number(pagination) * Number(process.env.DEFAULT_LIMIT),
                    limit: Number(process.env.DEFAULT_LIMIT)
                }
            }
            else if (typeof pagination != undefined && typeof limit != undefined) {
                options = {
                    lean: true,
                    sort: { _id: sort },
                    limit: Number(limit),
                    skip: Number(pagination) * Number(limit)
                }
            }
            return options
        }
        catch (err) {
            throw err;
        }
    }

    async encriptPass(pass: string) {
        try {
            const saltOrRounds = 10;
            const password = pass;
            return await bcrypt.hash(password, saltOrRounds);
        } catch (error) {
            throw error
        }
    }

    async bcriptPass(hash: string, password: string) {
        try {
            return await bcrypt.compare(hash, password);
        } catch (error) {
            throw error
        }
    }

    async createSession(body: any, token_data: any, authorization: string) {
        try {
            const { fcm_token, device_type } = body
            const { _id: user_id, scope } = token_data
            const data_to_save: any = {
                user_id: new Types.ObjectId(user_id),
                token_gen_at: +new Date(),
                device_type: device_type,
                access_token: authorization,
                scope: scope
            }
            if (!!fcm_token) {
                data_to_save.fcm_token = fcm_token
            }
            return this.Model.SessionModel.create(data_to_save)
        } catch (error) {
            throw error
        }
    }

    async GenerateOtp(size = 6) {
        try {
            const min = Math.pow(10, size - 1);
            const max = Math.pow(10, size) - 1;
            const code = Math.floor(min + Math.random() * (max - min + 1)).toString();
            return code
        } catch (error) {
            throw error;
        }
    };
}
