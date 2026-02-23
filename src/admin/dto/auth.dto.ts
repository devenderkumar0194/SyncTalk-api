import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ArrayNotEmpty, IsBoolean, IsEnum } from "class-validator";

export class Login {

    @ApiProperty({ required: true, default: "admin@gmail.com" })
    @IsEmail({}, { message: 'Please enter valid email Address' },)
    @IsNotEmpty()
    email: string;

    @ApiProperty({ required: true, default: "Admin@#123" })
    @IsString()
    @IsNotEmpty()
    password: string;

}

export class ChangedPassword {

    @ApiProperty({ default: "Admin@#123" })
    @IsString()
    @IsNotEmpty()
    current_password: string;

    @ApiProperty({ default: "Admin@#321" })
    @IsString()
    @IsNotEmpty()
    new_password: string;

}

export class ProfileUpdate {

    @ApiProperty({ default: "John Doe" })
    @IsString()
    full_name: string;

    @ApiProperty({ default: "image.png" })
    @IsString()
    profile_pic: string;

    @ApiProperty({ default: "+91" })
    @IsString()
    country_code: string;

    @ApiProperty({ default: "9801000000" })
    @IsString()
    phone_number: string;
}

export class ForgotPassword {

    @ApiProperty({ required: true, default: "admin@gmail.com" })
    @IsEmail({}, { message: 'Please enter valid email Address' },)
    @IsNotEmpty()
    email: string;
}

export class SetupPassword {

    @ApiProperty({ required: true, default: "Admin@123" })
    @IsString()
    @IsNotEmpty()
    password: string;

}

export class Reset_Password {

    @ApiProperty({ required: true, default: 123456 })
    @IsNotEmpty()
    otp: number;

}