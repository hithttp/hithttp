import { Controller, UseGuards, Post, Request, Body, ForbiddenException, BadRequestException, HttpException, Get, Put, NotFoundException } from '@nestjs/common';
import { ApiUseTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ResourceService } from '../resource/resource.service';
import { ApiService } from './api.service';
import { Validator } from 'jsonschema';
import { Api } from './api.entity';
import { v4 } from 'uuid';

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
    @Post(":uniqKey/:resName/")
    @ApiResponse({
        status: 200,
        description: 'The record has been successfully fetched.',
    })
    @ApiBearerAuth()
    async genericPost(@Request() req: any, @Body() body: any) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        try {
            let resource = await this.apiService.getUserResourceSchema(uniqKey, resName, "POST");
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
          let apiData =  await  this.apiService.storeUserResourceSchema(newSchema);
          apiData = {...apiData.data}
          delete apiData.data
          return apiData
        } catch (e) {
            throw e
        }

    }

    
    /**
    * 
    * Generic Get
    */
   @ApiOperation({ title: 'Generic Get' })
   @Get(":uniqKey/:resName/")
   @ApiResponse({
       status: 200,
       description: 'The record has been successfully fetched.',
   })
   @ApiBearerAuth()
   async genericGet(@Request() req: any) {
       let uniqKey = req.params.uniqKey;
       let resName = req.params.resName;
       try {
        let apiData = await this.apiService.listUserResourceSchema(uniqKey,resName)
        apiData = apiData.map(api=>{let apit =  {...api,...api.data};delete apit.data; return apit});
        return  apiData;
       } catch (e) {
           throw e
       }

   }

   /**
    * 
    * Generic Get Each
    */
   @ApiOperation({ title: 'Generic Get' })
   @Get(":uniqKey/:resName/:apiId")
   @ApiResponse({
       status: 200,
       description: 'The record has been successfully fetched.',
   })
   @ApiBearerAuth()
   async genericGetById(@Request() req: any) {
       let uniqKey = req.params.uniqKey;
       let resName = req.params.resName;
       let apiId = req.params.apiId;
       try {
        let apiData = await this.apiService.getByIdUserResourceSchema(uniqKey,resName,apiId)
        if(!apiData){
            throw new NotFoundException("Api does not exist")
        }
        apiData = {...apiData,...apiData.data}
        delete apiData.data
        return  apiData;
       } catch (e) {
           throw e
       }
   }

   
   /**
    * 
    * Generic Get Each
    */
   @ApiOperation({ title: 'Generic Put' })
   @Put(":uniqKey/:resName/:apiId")
   @ApiResponse({
       status: 200,
       description: 'The record has been successfully Uodated.',
   })
   @ApiBearerAuth()
   async genericUpdateById(@Request() req: any, @Body() body: any) {
       let uniqKey = req.params.uniqKey;
       let resName = req.params.resName;
       let apiId = req.params.apiId;
       try {
        let apiData = await this.apiService.getByIdUserResourceSchema(uniqKey,resName,apiId)
        if(!apiData){
            throw new NotFoundException("Api does not exist")
        }
        
        apiData.data = body;
        await  this.apiService.storeUserResourceSchema(apiData)
        apiData = {...apiData,...apiData.data}
        delete apiData.data
        return  apiData;
       } catch (e) {
           throw e
       }
   }
}
