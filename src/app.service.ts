import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ResourceService } from './resource/resource.service';

@Injectable()
export class AppService {
  constructor(
    private readonly userService: UsersService,
    private readonly resourceService: ResourceService,
  ) { }

  async getModels(userId:string) {
    return this.resourceService.findAll(userId);
  }

  async getModelDetails(id:string) {
    return this.resourceService.findOne(id);
  }
}
