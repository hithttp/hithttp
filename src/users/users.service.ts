import { Injectable, Request, InternalServerErrorException, Logger, NotFoundException, ConflictException } from '@nestjs/common';
import { v4 } from 'uuid';
import { hashSync } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { User } from './user.entity';
import { generate } from 'randomstring';
const logger = new Logger("UsersService")

@Injectable()
export class UsersService extends TypeOrmCrudService<User> {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
    ) {
        super(userRepository);
    }
    async register(req: User): Promise<User> {
        let existinguser = await this.userRepository.findOne({ where: { email: req.email } });
        if (existinguser) {
            throw new ConflictException("User Already registered");
        }
        let user = this.userRepository.create(req);
        user.password = hashSync(user.password, 10);
        user.token = v4();
        user.uniqkey = generate({
            length: 8,
            charset: 'alphanumeric'
          });
        try {
            await this.userRepository.save(user);
            delete user.password;
            return user;
        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException("Failed to register user");
        }
    }

    async logout(userId: string): Promise<Object> {
        try {
            return this.userRepository.update(userId, {
                token: v4()
            });

        } catch (e) {
            logger.error(e)
            throw new InternalServerErrorException();
        }
    }
}
