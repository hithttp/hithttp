import { IsString, IsEmail, Length, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUser {
    @ApiProperty({ required: true })
    @IsString()
    fullname: string;

    @ApiProperty({ required: true })
    @IsEmail()
    email: string;

    @ApiProperty({ required: true })
    @IsString()
    @Length(8, 15)
    password: string;

    @ApiProperty({ required: true })
    @IsString()
    @MinLength(390)
    captchaRes: string;

}