import { IsString, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';

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
   
    @ApiModelProperty()
    userId: string;
}