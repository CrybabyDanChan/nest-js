import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Service } from '../models'
import { User } from '../entities/user.entity';
import { EntityManager } from 'typeorm';

@Injectable()
export class UsersService extends Service {

    constructor(entities: EntityManager) {
        super(User, entities)
    }

    async getNotes(id) {
        let userRep = await this.entities.getRepository(User);
        let user = await userRep.findOne(id, { relations: ["notes"]});
        return user.notes;
    }

}
