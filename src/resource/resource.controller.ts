import { Controller, Post, UseGuards,Request, Body, InternalServerErrorException, Get } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { Resource } from './resource.entity';
import { ResourceService } from './resource.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { CreateResource } from './dtos/createResource.dto';
import { v4 } from 'uuid';

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
    async createResource(@Request() req: any,@Body() body:CreateResource) {
        let resource = new Resource();
       resource.method = body.method;
       resource.model = JSON.stringify(body.model);
       resource.userId = req.user.id;

        try{
            await this.resService.create(resource);
            return body
        }catch(e){
            throw new InternalServerErrorException("Failed to create REsource")
        }
       
    }

     /**
     * 
     * Create Resource
     */
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({ title: 'Resource List' })
    @Get()
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async ResList(@Request() req: any,@Body() body:CreateResource) {
        try{
             let resList = await this.resService.findAll(req.user.id);
             return resList.map(res=>{return {...res,model:JSON.parse(res.model)}})
        }catch(e){
            throw new InternalServerErrorException("Failed to create REsource")
        }
       
    }

}
