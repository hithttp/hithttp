import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export enum RequestMethods {
    "GET"="GET","POST"="POST","PUT"="PUT","OPTIONS"="OPTIONS","DELETE"="DELETE"
   }

export class CreateResource {
    @ApiModelProperty()
    @IsString()
    name: string;

    @ApiModelProperty()
    schema: Object;
   
    @ApiModelProperty({type:[RequestMethods],enum: Object.keys(RequestMethods)})
    @IsArray()
    @IsEnum(RequestMethods,{each:true})
    method: RequestMethods[];

    @ApiModelProperty()
    userId: string;
}