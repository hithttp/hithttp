import { IsString, IsJSON } from 'class-validator';
import { ApiModelProperty } from '@nestjs/swagger';
enum requestMethods {
    "GET"="GET","POST"="POST","PUT"="PUT","OPTIONS"="OPTIONS","DELETE"="DELETE"
   }

export class CreateResource {
    @ApiModelProperty()
    model: Object;
   
    @ApiModelProperty()
    method: requestMethods[];
   

    @ApiModelProperty()
    userId: string;
}