import { Controller, UseGuards, Post, Request, Body, ForbiddenException, BadRequestException, HttpException } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResourceService } from '../resource/resource.service';
import { ApiService } from './api.service';
import {Validator} from 'jsonschema';

@Controller('api')
@ApiUseTags('Api')
export class ApiController {
    constructor(
        private readonly resService: ResourceService,
        private readonly apiService: ApiService
    ) { }

    /**
    * 
    * Generic Post
    */
    @ApiOperation({ title: 'Generic Post' })
    @Post(":uniqKey/:resName/*")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async genericPost(@Request() req: any, @Body() body: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        try {
            let {schema} =  await this.apiService.getUserResourceModel(uniqKey,resName,"POST");
            var v = new Validator();
            // console.log(body,JSON.parse(schema))
            let {errors} =  v.validate(body, JSON.parse(schema));
                if(errors.length){
                    throw new BadRequestException(errors)
                }
                return {
                    statusCode:201,
                    message:"Successfully created "+resName
                }
        } catch (e) {
           throw e
        }

    }
}
