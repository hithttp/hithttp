import { Injectable, BadRequestException } from '@nestjs/common';
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

    async getUserResourceSchema(uniqkey: string, resName: string, reqType: string): Promise<any> {
        let user = await this.userRepository.findOne({
            where: { uniqkey }
        });
        if (!user) {
            throw new BadRequestException("Invalid unique key.")
        }
        let resource = await this.resRepository.createQueryBuilder()
            .where('"Resource"."name" = :name', { name: resName })
            .andWhere('"Resource"."userId" = :id', { id: user.id })
            .andWhere("'" + reqType + "' = ANY (method)")
            .getOne();
        if (!resource) {
            throw new BadRequestException("Resource requested is not available")
        }
        resource.user = user;
        return resource
    }

    async storeUserResourceSchema(schema: Api): Promise<any> {
        let schemaM = this.apiRepository.create(schema);
        return this.apiRepository.save(schemaM)
    }
    async listUserResourceSchema(uniqkey: string, resName: string): Promise<any> {
        return  await this.apiRepository.createQueryBuilder("api")
        .leftJoinAndSelect("api.resource", "resource", "resource.name = :name", { name: resName })
        .leftJoinAndSelect("api.user", "user", "user.uniqkey = :uniqkey", { uniqkey: uniqkey })
        .select(["api.id","api.data","api.createdAt","api.updatedAt"])
        .getMany();
    }
    async updateUserResourceSchema(uniqkey: string, resName: string): Promise<any> {
        return  await this.apiRepository.createQueryBuilder("api")
        .leftJoinAndSelect("api.resource", "resource", "resource.name = :name", { name: resName })
        .leftJoinAndSelect("api.user", "user", "user.uniqkey = :uniqkey", { uniqkey: uniqkey })
        .select(["api.id","api.data","api.createdAt","api.updatedAt"])
        .getMany();
    }

    async getByIdUserResourceSchema(uniqkey: string, resName: string,id:string): Promise<any> {
        return  await this.apiRepository.createQueryBuilder("api")
        .leftJoinAndSelect("api.resource", "resource", "resource.name = :name", { name: resName })
        .leftJoinAndSelect("api.user", "user", "user.uniqkey = :uniqkey", { uniqkey: uniqkey })
        .where("api.id = :id",{id})
        .select(["api.id","api.data","api.createdAt","api.updatedAt"])
        .getOne();
    }
}
