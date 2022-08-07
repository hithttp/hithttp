import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Any } from 'typeorm';
import { User } from '../users/user.entity';
import { Resource } from '../resource/resource.entity';
import { Api } from './api.entity';

@Injectable()
export class ApiService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Resource)
        private resRepository: Repository<Resource>,
        @InjectRepository(Api)
        private apiRepository: Repository<Api>,
    ) { }

    async findByResId(resId: string, userId: string): Promise<Api[]> {
        return await this.apiRepository.find({
            where: {
                resource: { id: resId },
                user: { id: userId }
            }
        })
    }
    async findOneByResId(id: string, resId: string, userId: string): Promise<Api> {
        return await this.apiRepository.findOne({
            where: {
                id,
                user: { id: userId },
                resource: { id: resId }
            }
        })
    }

    async getUserResourceSchema(uniqkey: string, resName: string): Promise<any> {
        let user = await this.userRepository.findOne({
            where: { uniqkey }
        });
        if (!user) {
            throw new BadRequestException("Invalid unique key.")
        }
        let resource = await this.resRepository.createQueryBuilder()
            .where('"Resource"."name" = :name', { name: resName })
            .andWhere('"Resource"."userId" = :id', { id: user.id })
            .getOne();
        if (!resource) {
            throw new BadRequestException("Resource requested is not available")
        }
        resource.user = user;
        return resource
    }

    async save(schema: Api): Promise<any> {
        let schemaM = this.apiRepository.create(schema);
        return this.apiRepository.save(schemaM)
    }
    async listUserResourceSchema(uniqkey: string, resName: string): Promise<any> {
        return await this.apiRepository.createQueryBuilder("api")
            .leftJoinAndSelect("api.resource", "resource")
            .leftJoinAndSelect("api.user", "user")
            .where("resource.name = :name", { name: resName })
            .andWhere("user.uniqkey = :uniqkey", { uniqkey: uniqkey })
            .select(["api.id", "api.data", "api.createdAt", "api.updatedAt"])
            .getMany();
    }
    async getOneUserResourceSchema(uniqkey: string, resName: string): Promise<any> {
        return await this.apiRepository.createQueryBuilder("api")
            .leftJoinAndSelect("api.resource", "resource")
            .leftJoinAndSelect("api.user", "user")
            .where("resource.name = :name", { name: resName })
            .andWhere("user.uniqkey = :uniqkey", { uniqkey: uniqkey })
            .select(["api.id", "api.data", "api.createdAt", "api.updatedAt"])
            .getMany();
    }

    async getByIdUserResourceSchema(uniqkey: string, resName: string, id: string): Promise<any> {
        return await this.apiRepository.createQueryBuilder("api")
            .leftJoinAndSelect("api.resource", "resource")
            .leftJoinAndSelect("api.user", "user")
            .where("resource.name = :name", { name: resName })
            .andWhere("api.id = :id", { id })
            .andWhere("user.uniqkey = :uniqkey", { uniqkey: uniqkey })
            .select(["api.id", "api.data", "api.createdAt", "api.updatedAt"])
            .getOne();
    }
    async deleteApiById(uniqkey: string, resName: string, id: string): Promise<any> {
        let apiData = await this.apiRepository.createQueryBuilder("api")
            .leftJoinAndSelect("api.resource", "resource")
            .leftJoinAndSelect("api.user", "user")
            .where("resource.name = :name", { name: resName })
            .andWhere("api.id = :id", { id })
            .andWhere("user.uniqkey = :uniqkey", { uniqkey: uniqkey })
            .select(["api.id", "api.data", "api.createdAt", "api.updatedAt"])
            .getOne();
        if (apiData) {
            await this.apiRepository.delete(id)
            return {
                success: true,
                message: "Successfully deleted api"
            }
        } else {
            throw new InternalServerErrorException("Failed to delete Api Data")
        }

    }
}
