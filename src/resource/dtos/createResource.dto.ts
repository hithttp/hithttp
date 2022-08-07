import { IsString, IsArray, IsEnum, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class PropertyType {
    @ApiProperty()
    type:string
}
export class CreateResource {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({type:[PropertyType]})
    properties:PropertyType[]
}