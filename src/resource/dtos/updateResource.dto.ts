import { IsString, IsArray, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
class PropertyType {
    @ApiProperty()
    type:string
}
export class UpdateResource {
    @ApiProperty()
    @IsString()
    id: string;

    @ApiProperty()
    @IsString()
    name: string;
   
    @ApiProperty({type:[PropertyType]})
    properties:PropertyType[]
   
}