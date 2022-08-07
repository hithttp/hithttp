import { Injectable, Logger, InternalServerErrorException, ConflictException, BadRequestException } from '@nestjs/common';
import { Resource } from './resource.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UpdateResource } from './dtos/updateResource.dto';
import { User } from '../users/user.entity';
import { Api } from '../api/api.entity';
const logger = new Logger("ResourceService")

@Injectable()
export class ResourceService extends TypeOrmCrudService<Resource> {
    constructor(
        @InjectRepository(Resource)
        private resRepository: Repository<Resource>,
        @InjectRepository(Api)
        private apiRepository: Repository<Api>
    ) {
        super(resRepository);
    }

    async create(resource: Resource): Promise<Resource> {
        try {
            let existingResource = await this.resRepository.findOne({ where: { name: resource.name, user: { id: resource.user.id } } });
            if (existingResource) {
                throw new ConflictException("Resource already exists");
            }
            let newRes = this.resRepository.create(resource);
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
            return this.resRepository.find({ where: { user: { id: userId } } });
        } catch (e) {
            logger.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }
    async findByUserId(userId: string): Promise<Resource[]> {
        try {
            return this.resRepository.find({ where: { user: { id: userId } } });
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
        let existingResource = await this.resRepository.find({ where: { name: res.name, user: { id: userId } } });
        if (existingResource.length > 1) {
            throw new ConflictException("There is another resource with the same name");
        }
        if (existingResource[0].id != resId) {
            throw new InternalServerErrorException("Invalid resource found");
        }
        try {
            return this.resRepository.update({ id: resId }, res);
        } catch (e) {
            console.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }

    /**
     * 
     * @param id 
     * @param userId 
     */
    async delete(id: string, user: User): Promise<any> {
        let apis = await this.apiRepository.findBy({ resource: { id } })
        if (apis.length) {
            throw new BadRequestException("This resource has active apis, Please delete apis before deleting this resource.")
        }
        try {
            return this.resRepository.delete({ id, user })
        } catch (e) {
            logger.log(e)
            throw new InternalServerErrorException("Failed to get resource List");
        }
    }
}
