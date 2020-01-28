import { Injectable } from '@nestjs/common';
import { Service } from 'src/models';
import { EntityManager } from 'typeorm';
import { Note } from 'src/entities/note.entity';
import { Tag } from 'src/entities/tags.entity';

@Injectable()
export class NoteService extends Service{

    constructor(entities: EntityManager) {
        super(Note, entities)
    }

    async getFullTable() {
        let tagRep = this.entities.getRepository(Tag);
        let notesArr = await this.entities.find(this.entity);
        notesArr.map((el) => {
            el.tags = this.entities.find(Tag, { 
                relations: ['note'],
                where: { id: el.id } 
            })
        })
        return notesArr
    }

}
