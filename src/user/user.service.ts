import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Service } from '../models'
import { User } from '../entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService extends Service {

    constructor(entities: EntityManager) {
        super(User, entities)
    }

    async getPosts(id) {
        let userRep = await this.entities.getRepository(User);
        let user = await userRep.findOne(id, { relations: ["posts"]});
        return user.posts;
    }

    async addRow(user) {
        let newUser = await this.entities.findOne(User, { name: user.name} );
        if (newUser) {
            throw new HttpException('User already exists', 400);
        }
        newUser = await this.entities.create(User, user);
        await this.entities.save(newUser)
        let {password, ...result} = user;
        return result;
    }
    
}
