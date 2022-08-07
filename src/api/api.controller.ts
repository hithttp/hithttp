import { Controller, UseGuards, Post, Request, Body, ForbiddenException, BadRequestException, HttpException, Get, Put, NotFoundException, Delete, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ResourceService } from '../resource/resource.service';
import { ApiService } from './api.service';
import { Validator } from 'jsonschema';
import { Api } from './api.entity';
import { v4 } from 'uuid';

@Controller('api')
@ApiTags('Api')
export class ApiController {
    constructor(
        private readonly resService: ResourceService,
        private readonly apiService: ApiService
    ) { }

    /**
    * 
    * Generic Post
    */
    @ApiOperation({ summary: 'Generic Post' })
    @Post(":uniqKey/:resName/")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    async genericPost(@Request() req: any, @Body() body: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        try {
            let resource = await this.apiService.getUserResourceSchema(uniqKey, resName);
            var v = new Validator();
            // console.log(body,resource.schema)
            let { errors } = v.validate(body, resource.schema);
            if (errors.length) {
                throw new BadRequestException(errors)
            }

            let newSchema = new Api();
            newSchema.id = v4();
            newSchema.data = body;
            newSchema.user = resource.user
            newSchema.resource = resource
            let apiData = await this.apiService.save(newSchema);
            let napiData = { ...apiData.data }
            delete apiData.data
            delete apiData.user
            delete apiData.resource
            return { ...apiData, ...napiData };
        } catch (e) {
            throw e
        }

    }


    /**
    * 
    * Generic Get
    */
    @ApiOperation({ summary: 'Generic Get' })
    @Get(":uniqKey/:resName/")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    async genericGet(@Request() req: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        try {
            let apiData = await this.apiService.listUserResourceSchema(uniqKey, resName);
            apiData = apiData.map(api => { let apit = { ...api.data }; delete api.data; return { ...api,...apit} });
            return apiData;
        } catch (e) {
            throw e
        }

    }

    /**
     * 
     * Generic Get Each
     */
    @ApiOperation({ summary: 'Generic Get' })
    @Get(":uniqKey/:resName/:apiId")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    async genericGetById(@Request() req: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        let apiId = req.params.apiId;
        try {
            let apiData = await this.apiService.getByIdUserResourceSchema(uniqKey, resName, apiId)
            if (!apiData) {
                throw new NotFoundException("Api does not exist")
            }
            let napiData = { ...apiData.data }
            delete apiData.data
            return { ...apiData, ...napiData };
        } catch (e) {
            throw e
        }
    }
    /**
     * 
     * Generic Delete
     */
    @ApiOperation({ summary: 'Generic Delete' })
    @Delete(":uniqKey/:resName/:apiId")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully Deleted.',
    })
    async genericDelete(@Request() req: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        let apiId = req.params.apiId;
        try {
            return await this.apiService.deleteApiById(uniqKey, resName, apiId)
        } catch (e) {
            throw e
        }
    }


    /**
     * 
     * Generic Get Each
     */
    @ApiOperation({ summary: 'Generic Put' })
    @Put(":uniqKey/:resName/:apiId")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully Uodated.',
    })
    async genericUpdateById(@Request() req: any, @Body() body: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        let apiId = req.params.apiId;
        let resource = await this.apiService.getUserResourceSchema(uniqKey, resName);
        this.validate(body, resource.schema)
        try {
            let apiData = await this.apiService.getByIdUserResourceSchema(uniqKey, resName, apiId)
            if (!apiData) {
                throw new NotFoundException("Api does not exist")
            }

            apiData.data = body;
            await this.apiService.save(apiData)
            let napiData = { ...apiData.data }
            delete apiData.data
            return { ...apiData, ...napiData };
        } catch (e) {
            throw e
        }
    }
    private validate(data: any, schema: any) {
        var v = new Validator();
        let { errors } = v.validate(data, schema);
        if (errors.length) {
            throw new BadRequestException(errors)
        }

    }
}
