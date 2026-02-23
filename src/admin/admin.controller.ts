import { Body, Controller, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import * as dto from './dto/index';
import { AdminService } from './admin.service';
import { AuthGuard } from 'src/guard/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('admin')
export class AdminController {

    constructor(
        private readonly AuthService: AdminService,
    ) { }


    @Post('login')
    async login(@Body() dto: dto.auth.Login, @Request() req: any) {
        try {
            const data = await this.AuthService.login(dto);
            const response = {
                success: true,
                message: `You have been login successfully!`,
                data: data,
            };
            return response;
        } catch (err) {
            throw err;
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('authorization')
    @Get('profile')
    async get_profile(@Request() req: any) {
        try {
            const data = await this.AuthService.profile(req);
            const response = {
                success: true,
                message: `Profile fetch successfully!`,
                data: data,
            };
            return response;
        } catch (err) {
            throw err;
        }
    }


    @UseGuards(AuthGuard)
    @ApiBearerAuth('authorization')
    @Put('profile/update')
    async profile_update(@Request() req: any, @Body() body: dto.auth.ProfileUpdate) {
        try {
            const data = await this.AuthService.updateProfile(req, body);
            const response = {
                success: true,
                message: `Profile updated successfully!`,
                data: data,
            };
            return response;
        } catch (err) {
            throw err;
        }
    }

    @UseGuards(AuthGuard)
    @ApiBearerAuth('authorization')
    @Put('password/change')
    async change_password(@Body() dto: dto.auth.ChangedPassword, @Request() req: any) {
        try {
            const data = await this.AuthService.changePassword(req, dto);
            const response = {
                success: true,
                message: `Password changed successfully!`,
                data: data,
            };
            return response;
        } catch (err) {
            throw err;
        }
    }
}
