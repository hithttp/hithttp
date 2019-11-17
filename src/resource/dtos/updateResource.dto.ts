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
    model: Object;
   
    @ApiModelProperty({type:[RequestMethods],enum: Object.keys(RequestMethods)})
    @IsArray()
    @IsEnum(RequestMethods,{each:true})
    method: RequestMethods[];
    
}