import { Controller, Post, UseGuards, Request, Body, InternalServerErrorException, Get, ConflictException, Put, Delete, Res } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { Response } from 'express';
import { ResourceService } from './resource.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { CreateResource } from './dtos/createResource.dto';
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
    async createResource(@Request() req: any, @Body() body: CreateResource, @Res() res: any) {
        let resource = new Resource();
        resource.name = body.name;
        resource.schema = {
            id: body.name,
            type: "object",
            properties: body.properties,
            required: Object.keys(body.properties),
            additionalProperties: false
        };
        resource.user = req.user;
        try {
            await this.resService.create(resource);
            return res.redirect("resource/list")
        } catch (e) {
            console.log(e)
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
            return resList
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
    @Put()
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully updated.',
    })
    @ApiBearerAuth()
    async updateResource(@Request() req: any, @Body() body: UpdateResource) {
        try {
            let resource = new Resource();
            resource.name = body.name;
            resource.id = body.id;
            resource.schema = {
                id: body.name,
                type: "object",
                properties: body.properties,
                required: Object.keys(body.properties),
                additionalProperties: false
            };
            resource.user = req.user;
            await this.resService.update(resource.id, req.user.id, resource);

            return { ...resource, schema: resource.schema };
        } catch (e) {
            console.log(e)
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
    async deleteResource(@Request() req: any, @Res() res: any) {
        try {
            await this.resService.delete(req.params.resId, req.user.id);
            return res.redirect("/dashboard/resource/list")
        } catch (e) {
            if (e.status == 400) {
                throw e
            }
            console.log(e)
            throw new InternalServerErrorException("Failed to Delete Resource")
        }

    }
}
