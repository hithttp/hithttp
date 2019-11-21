import { Controller, Post, UseGuards, Request, Body, InternalServerErrorException, Get, ConflictException, Put, Delete } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { ResourceService } from './resource.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { CreateResource, RequestMethods } from './dtos/createResource.dto';
import { v4 } from 'uuid';
import { UpdateResource } from './dtos/updateResource.dto';

@Controller('resource')
@ApiUseTags('Resource')
export class ResourceController {
    constructor(
        @InjectRepository(Resource)
        private resRepository: Repository<Resource>,
        private readonly resService: ResourceService
    ) { }

    /**
     * 
     * Create Resource
     */
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Create resource' })
    @Post()
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async createResource(@Request() req: any, @Body() body: CreateResource) {
        let resource = new Resource();
        resource.name = body.name;
        resource.method = body.method;
        body.schema.id = body.name
        resource.schema = JSON.stringify(body.schema);
        resource.user = req.user;
        try {
            return await this.resService.create(resource);
        } catch (e) {
            if (e.status == 409) {
                throw e
            }
            throw new InternalServerErrorException("Failed to create REsource")
        }

    }

    /**
    * 
    * Resource List
    */
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Resource List' })
    @Get()
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async ResList(@Request() req: any) {
        try {
            let resList = await this.resService.findAll(req.user.id);
            return resList.map(res => { return { ...res, schema: JSON.parse(res.schema) } })
        } catch (e) {
            throw new InternalServerErrorException("Failed to create REsource")
        }

    }


    /**
    * 
    * Update Resource
    */
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Update Resource' })
    @Put(":resId")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @ApiBearerAuth()
    async updateResource(@Request() req: any, @Body() body: UpdateResource) {
        try {
            let res = new Resource();
            res.method = body.method;
            res.schema = JSON.stringify(body.schema);
            res.name = body.name;
            await this.resService.update(req.params.resId, req.user.id, res);

            return { ...res, schema: JSON.parse(res.schema) };
        } catch (e) {
            if (e.status == 409) {
                throw e
            }
            throw new InternalServerErrorException("Failed to create REsource")
        }

    }

    /**
    * 
    * Delete Resource
    */
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Delete Resource' })
    @Delete(":resId")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @ApiBearerAuth()
    async deleteResource(@Request() req: any) {
        try {
            await this.resService.delete(req.params.resId, req.user.id);
            return {
                status: "success",
                message: "Successfully deleted"
            }
        } catch (e) {
            if (e.status == 409) {
                throw e
            }
            throw new InternalServerErrorException("Failed to create REsource")
        }

    }

}
