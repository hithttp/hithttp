import {IsString, IsEmail, Length} from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class LoginUser {
    @ApiModelProperty()
    @IsEmail()
    email: string;

    @ApiModelProperty()
    @IsString()
    @Length(8,15)
    password: string;
}