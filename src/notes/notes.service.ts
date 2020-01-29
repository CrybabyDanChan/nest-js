import { Injectable } from '@nestjs/common';
import { Service } from 'src/models';
import { EntityManager } from 'typeorm';
import { Note } from 'src/entities/note.entity';
import { Tag } from 'src/entities/tags.entity';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class NoteService extends Service{

    constructor(entities: EntityManager, private tagService: TagsService) {
        super(Note, entities)
    }

    async getFullTable() {
        let notesArr = await this.entities.find(this.entity, { relations: ["tag"] })
        return notesArr
    }

    async addTagToNote(id, tags) {
        let notesRep = this.entities.getRepository(Note);
        console.log(notesRep)
        let noteEntity = await notesRep.findOne(id, { relations: ["tag"] });
        console.log(noteEntity)
        await this.tagService.addTag(tags).then(() => {
            tags.forEach(async tag => {
                let tagEntity = await this.entities.findOne(Tag, { content: tag });
                let tagIsPresent = noteEntity.tag.find(tagEnt => tagEnt.content === tag);
                if (!tagIsPresent) {
                    noteEntity.tag.push(tagEntity);
                    await this.entities.save(noteEntity);
                }
            })
        })

        let resultEntity = await notesRep.findOne(id, { relations: ["tag"] });
        return resultEntity
    }


    async getTags(id) {
        let notesRep = this.entities.getRepository(Note);
        let note = await notesRep.findOne(id, { relations: ["tag"]});
        return note.tag;
    }
}
