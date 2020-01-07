import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export enum RequestMethods {
    "GET"="GET","POST"="POST","PUT"="PUT","OPTIONS"="OPTIONS","DELETE"="DELETE"
   }

export class UpdateResource {
    @ApiModelProperty()
    @IsString()
    name: string;

    @ApiModelProperty()
    schema: Object;
   
}