import { Injectable } from '@nestjs/common';
import { Service } from 'src/models';
import { EntityManager } from 'typeorm';
import { Note } from 'src/entities/note.entity';

@Injectable()
export class NoteService extends Service{

    constructor(entities: EntityManager) {
        super(Note, entities)
    }

}
