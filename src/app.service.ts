import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { ResourceService } from './resource/resource.service';

@Injectable()
export class AppService {
  constructor() { }
}
