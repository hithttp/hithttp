import { IsString, IsEmail, Length, MinLength } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class RegisterUser {
    @ApiModelProperty({ required: true })
    @IsString()
    fullname: string;

    @ApiModelProperty({ required: true })
    @IsEmail()
    email: string;

    @ApiModelProperty({ required: true })
    @IsString()
    @Length(8, 15)
    password: string;

    @ApiModelProperty({ required: true })
    @IsString()
    @MinLength(390)
    captchaRes: string;

}