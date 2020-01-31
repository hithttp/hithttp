import { IsString, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
class PropertyType {
    @ApiModelProperty()
    type:string
}
export class CreateResource {
    @ApiModelProperty()
    @IsString()
    name: string;

    @ApiModelProperty({type:[PropertyType]})
    properties:PropertyType[]
}