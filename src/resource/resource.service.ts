import { Injectable, Logger, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { Resource } from './resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UpdateResource } from './dtos/updateResource.dto';
import { User } from '../users/user.entity';
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
        let existingResource = await this.resRepository.findOne({ where: { name: resource.name, userId: resource.user.id } });
        if (existingResource) {
            throw new ConflictException("Resource already exists");
        }
        let newRes = this.resRepository.create(resource);
        try {
            await this.resRepository.save(newRes);
            delete newRes.user;
            return newRes;
        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to create resource");
        }
    }

    async findAll(userId: string): Promise<Resource[]> {
        try {
            return this.resRepository.find({ where: { userId } });
        } catch (e) {
            logger.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }
    /**
     * 
     * @param resId 
     * @param userId 
     * @param res 
     */
    async update(resId: string, userId: string, res: Resource): Promise<any> {
        try {
            let existingResource = await this.resRepository.findOne({ where: { name: res.name, userId: userId } });
            if (existingResource && existingResource.id != resId) {
                throw new ConflictException("There is another resource with the same name");
            }
            return this.resRepository.update({ id: resId }, res);
        } catch (e) {
            logger.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }

    /**
     * 
     * @param id 
     * @param userId 
     */
    async delete(id: string, user: User): Promise<any> {
        try {
            return this.resRepository.delete({id,user})
        } catch (e) {
            logger.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }
}
