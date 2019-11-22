import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Any } from 'typeorm';
import { User } from '../users/user.entity';
import { Resource } from '../resource/resource.entity';

@Injectable()
export class ApiService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Resource)
        private resRepository: Repository<Resource>,
    ) { }

    async getUserResourceModel(uniqkey: string, resName: string, reqType: string): Promise<any> {
        let { id } = await this.userRepository.findOne({
            where: { uniqkey }
        });

        return this.resRepository.createQueryBuilder()
            .where('"Resource"."name" = :name', { name: resName })
            .andWhere('"Resource"."userId" = :id', { id })
            .andWhere("'" + reqType + "' = ANY (method)")
            .getOne();
    }
}
