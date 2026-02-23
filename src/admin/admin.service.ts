import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';
import { UserStatus } from 'src/database/schemas/user.schema';
import { Types } from 'mongoose';
import * as dto from './dto/index';


@Injectable()
export class AdminService {
    constructor(
        private readonly Model: DatabaseService,
        private readonly CommonService: CommonService,
    ) {
    }

    login = async (dto: dto.auth.Login) => {
        try {
            const { email, password } = dto;

            const user = await this.Model.UserModel.findOne({ email: email.toLowerCase(), is_deleted: false })
                .select('+password')
                .lean();

            if (!user) {
                throw new HttpException(`Oops! It looks like your login details are incorrect. Please try again.`, HttpStatus.BAD_REQUEST)
            }

            if (!user.password) {
                throw new HttpException(`Oops! It looks like you haven’t set up your password yet. A password setup link has been sent to your email.`, HttpStatus.BAD_REQUEST)
            }

            const verifyPassword = await bcrypt.compare(password, user.password);

            if (!verifyPassword) {
                throw new HttpException('Oops! The password you entered is incorrect. Please try again.', HttpStatus.BAD_REQUEST);
            }

            if (user.status === UserStatus.BLOCK) {
                throw new HttpException('Oops! Your account is blocked by admin. Please contact admin.', HttpStatus.BAD_REQUEST);
            }

            const token_payload = {
                _id: user._id,
                scope: `${user.role}_SCOPE`,
                token_gen_at: +new Date(),
                role: user.role
            };
            const token = await this.CommonService.generateToken(token_payload);
            let save_session = await this.CommonService.createSession(
                user,
                token_payload,
                token
            );
            delete user['password'];
            // user['access_token'] = token;
            return {    
                access_token: token,
                user: user,
            };
        } catch (err) {
            throw err;
        }
    };

    profile = async (req: any) => {
        try {
            const { _id: user_id } = req.user;
            const user = await this.Model.UserModel.findOne({ _id: new Types.ObjectId(user_id) });
            return user;
        } catch (error) {
            throw error;
        }
    }

    changePassword = async (req: any, dto: dto.auth.ChangedPassword) => {
        try {
            const { _id: user_id } = req.user;
            const { current_password, new_password } = dto;
            const user = await this.Model.UserModel.findOne({ _id: new Types.ObjectId(user_id) }, { password: true }, { lean: true });
            const verifyPassword = await bcrypt.compare(current_password, user.password);

            if (!verifyPassword) {
                throw new HttpException('Oops! The current password does not match. Please try again.', HttpStatus.BAD_REQUEST);
            }

            await this.Model.UserModel.findOneAndUpdate(
                { _id: new Types.ObjectId(user_id), },
                { password: await this.CommonService.encriptPass(new_password) },
                { lean: true }
            );
            return true;
        } catch (error) {
            throw error;
        }
    }

    updateProfile = async (req: any, body: dto.auth.ProfileUpdate) => {
        try {
            const { _id: user_id } = req.user;
            const { full_name, profile_pic, country_code, phone_number } = body;

            const user = await this.Model.UserModel.findOneAndUpdate(
                { _id: new Types.ObjectId(user_id) },
                {
                    ...(full_name && { full_name: full_name.trim() }),
                    ...(profile_pic && { profile_pic: profile_pic }),
                    country_code: country_code,
                    phone_number: phone_number,
                },
                { new: true, lean: true },
            );

            return user;
        } catch (error) {
            throw error;
        }
    }

    forgotPassword = async (dto: dto.auth.ForgotPassword) => {
        try {
            const email = dto.email.toLowerCase();
            const otp = "123456"; // await this.CommonService.GenerateOtp(6);

            const user = await this.Model.UserModel.findOne({ email: email.toLowerCase(), is_deleted: false })
                .select('+password')
                .lean();

            if (!user) {
                throw new HttpException(`Oops! It looks like your email is incorrect. Please try again.`, HttpStatus.BAD_REQUEST)
            }

            if (!user.password) {
                throw new HttpException(`Oops! It looks like you haven’t set up your password yet. A password setup link has been sent to your email.`, HttpStatus.BAD_REQUEST)
            }

            const token_payload = {
                _id: user._id,
                scope: `FORGOT_PASSWORD_SCOPE`,
                token_gen_at: +new Date(),
                email_otp: parseInt(otp)
            };
            const token = await this.CommonService.generateToken(token_payload);

            await this.CommonService.createSession({},
                token_payload,
                token
            );

            // this.send_email_verification({ email: email.toLowerCase(), otp });
            return token;
        } catch (error) {
            throw error;
        }
    }
}
