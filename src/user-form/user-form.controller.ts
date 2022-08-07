import { Controller, UseGuards, Post, Request, Body, ForbiddenException, BadRequestException, HttpException, Get, Put, NotFoundException, Delete, Res } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { ResourceService } from '../resource/resource.service';
import { ApiService } from '../api/api.service';

@Controller('user-form')
@ApiTags("User Form Input")
export class UserFormController {
    constructor(
        private readonly resService: ResourceService,
        private readonly apiService: ApiService
    ) { }
    @Get(":uniqKey/:resName")
    async newApiData(@Request() req: any, @Res() res: Response) {
        let uniqKey = req.params.uniqKey;
        let resName = req.params.resName;
        let resource = await this.apiService.getUserResourceSchema(uniqKey, resName);
        let apiData = {
            data: {}
        }
        for (let key in resource.schema.properties) {
            apiData.data[key] = {
                value: "",
                type: resource.schema.properties[key].type
            }
        }
        return res.render("dashboard/pages/user-form/user-form", { layout: "dashboard/layout/dashboard", user: req.user, apiData,resource });
    }
    @Get("success")
    async sucessPage(@Request() req: any, @Res() res: Response) {
        return res.render("dashboard/pages/user-form/form-success", { layout: "dashboard/layout/dashboard"});
    }
}
