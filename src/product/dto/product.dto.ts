import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber, IsArray, ArrayNotEmpty, IsBoolean, IsEnum, isString } from "class-validator";

export class AddProductDto {

    @ApiProperty({ required: true, default: "product name" })
    @IsString()
    name: string;

    @ApiProperty({ required: true, default: 0 })
    @IsNumber()
    @IsNotEmpty()
    price: number;
    
}