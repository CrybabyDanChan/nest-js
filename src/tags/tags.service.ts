import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';

@Injectable()
export class TagsService {
    constructor(private entities: EntityManager) { }
}
