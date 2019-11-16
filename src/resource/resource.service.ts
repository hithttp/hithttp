import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { Resource } from './resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
const logger = new Logger("ResourceService")

@Injectable()
export class ResourceService extends TypeOrmCrudService<Resource> {
    constructor(
        @InjectRepository(Resource)
        private resRepository: Repository<Resource>,
    ) {
        super(resRepository);
    }

    async create(resource: Resource): Promise<Resource> {
        let newRes = this.resRepository.create(resource);
        try {
            await this.resRepository.save(newRes);
          
            return newRes;
        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to create resource");
        }
    }

    async findAll(userId:string): Promise<Resource[]> {
        try {
            return  this.resRepository.find({where:{userId}});
        } catch (e) {
            logger.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }
}
