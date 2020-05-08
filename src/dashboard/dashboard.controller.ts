import { Controller, Post, UseGuards, Request, Body, InternalServerErrorException, Get, ConflictException, Put, Delete, Res, Param } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { Resource } from '../resource/resource.entity';
import { Response } from 'express';
import { ResourceService } from '../resource/resource.service';
import { ApiService } from '../api/api.service';

@Controller('dashboard')
export class DashboardController {
    constructor(
        private readonly resService: ResourceService,
        private readonly apiService: ApiService
    ) { }
    /** Resources operation start */

    @Get("resource/new")
    async newResources(@Request() req: any, @Res() res: Response) {
        let resources = await this.resService.findAll(req.user.id)
        return res.render("dashboard/pages/resources/create", { layout: "dashboard/layout/dashboard", user: req.user, resources });
    }

    @Get("resource/list")
    async resources(@Request() req: any, @Res() res: Response) {
        let resources = await this.resService.findAll(req.user.id)
        let host = req.headers.host
        return res.render("dashboard/pages/resources/index", { layout: "dashboard/layout/dashboard", user: req.user, resources, host });
    }

    @Get("resource/:id/view")
    async viewResource(@Request() req: any, @Res() res: Response) {
        let resource = await this.resService.findOne(req.params.id)
        return res.render("dashboard/pages/resources/view", { layout: "dashboard/layout/dashboard", user: req.user, resource });
    }

    @Get("resource/:id/edit")
    async editResource(@Request() req: any, @Res() res: Response) {
        let resource = await this.resService.findOne(req.params.id)

        return res.render("dashboard/pages/resources/edit", { layout: "dashboard/layout/dashboard", user: req.user, resource });
    }

    @Get("resource/:id/delete")
    async deleteResourceUI(@Request() req: any, @Res() res: Response) {
        let resources = await this.resService.findAll(req.user.id)

        return res.render("dashboard/pages/resources/delete", { layout: "dashboard/layout/dashboard", user: req.user, resources });
    }


    /** Resources operation end */

    /** Api-Data operation start */

    @Get("resource/:resId/api-data/new")
    async newApiData(@Request() req: any, @Res() res: Response) {
        let resource = await this.resService.findOne(req.params.resId);
        let apiData = {
            data: {}
        }
        for (let key in resource.schema.properties) {
            apiData.data[key] = {
                value: "",
                type: resource.schema.properties[key].type
            }
        }
        return res.render("dashboard/pages/api-data/create", { layout: "dashboard/layout/dashboard", user: req.user, apiData,resource });
    }

    @Get("resource/:id/api-data")
    async viewResourceApiData(@Param("id") resId: string, @Request() req: any, @Res() res: Response) {
        let apiData = await this.apiService.findByResId(resId, req.user.id)
        let resource = await this.resService.findOne(req.params.id)
        return res.render("dashboard/pages/resources/api-data", { layout: "dashboard/layout/dashboard", user: req.user, apiData, resource });
    }

    @Get("resource/:resId/api-data/:id/view")
    async viewApiData(@Request() req: any, @Param("resId") resId: any, @Res() res: Response) {
        let apiData = await this.apiService.findOneByResId(req.params.id, req.params.resId, req.user.id)
        return res.render("dashboard/pages/api-data/view", { layout: "dashboard/layout/dashboard", user: req.user, apiData, resId });
    }

    @Get("resource/:resId/api-data/:id/edit")
    async editApiData(@Request() req: any, @Res() res: Response) {
        let apiDataRes = await this.apiService.findOneByResId(req.params.id, req.params.resId, req.user.id)
        let resource = await this.resService.findOne(req.params.resId);
        let apiData = {
            id: apiDataRes.id,
            data: {}
        }
        for (let key in apiDataRes.data) {
            apiData.data[key] = {
                value: apiDataRes.data[key],
                type: resource.schema.properties[key].type
            }
        }
        return res.render("dashboard/pages/api-data/edit", { layout: "dashboard/layout/dashboard", user: req.user, apiData, resource });
    }

    @Get("resource/:resId/api-data/:id/delete")
    async deleteApiData(@Request() req: any, @Res() res: Response) {
        let apiData = await this.resService.findAll(req.user.id)

        return res.render("dashboard/pages/api-data/delete", { layout: "dashboard/layout/dashboard", user: req.user, apiData });
    }


    /** Api-Data operation end */


}
