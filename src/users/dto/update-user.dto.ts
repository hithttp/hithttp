import { IsString } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

export class UpdateUser {
    @ApiModelProperty()
    @IsString()
    firstname: string;

    @ApiModelProperty()
    @IsString()
    lastname: string;

    @ApiModelProperty()
    @IsString()
    phone: string;

    @ApiModelProperty()
    @IsString()
    city: string;

    @ApiModelProperty()
    @IsString()
    country: string;

    @ApiModelProperty()
    @IsString()
    address: string;

    @ApiModelProperty()
    @IsString()
    price: string;

    @ApiModelProperty()
    @IsString()
    nationalid: string;
}