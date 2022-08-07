import {IsString, IsEmail, Length} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUser {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsString()
    @Length(8,15)
    password: string;
}