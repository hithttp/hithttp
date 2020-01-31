import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
class PropertyType {
    @ApiModelProperty()
    type:string
}
export class UpdateResource {
    @ApiModelProperty()
    @IsString()
    id: string;

    @ApiModelProperty()
    @IsString()
    name: string;
   
    @ApiModelProperty({type:[PropertyType]})
    properties:PropertyType[]
   
}