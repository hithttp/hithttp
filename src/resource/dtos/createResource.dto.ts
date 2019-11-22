import { IsString, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
export enum RequestMethods {
    "GET"="GET","POST"="POST","PUT"="PUT","OPTIONS"="OPTIONS","DELETE"="DELETE"
   }

class Schema {
    @IsString()
    id:string;

    @ApiModelProperty()
    @IsString()
    type:string;
    
    @ApiModelProperty()
    properties:object;
}

export class CreateResource {
    @ApiModelProperty()
    @IsString()
    name: string;

    @ApiModelProperty()
    @ValidateNested()
    schema: Schema;
   
    @ApiModelProperty({type:[RequestMethods],enum: Object.keys(RequestMethods)})
    @IsArray()
    @IsEnum(RequestMethods,{each:true})
    method: RequestMethods[];

    @ApiModelProperty()
    userId: string;
}