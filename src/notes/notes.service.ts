import { Injectable } from '@nestjs/common';
import { Service } from 'src/models';
import { EntityManager } from 'typeorm';
import { Note } from 'src/entities/note.entity';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class NoteService extends Service{

    constructor(entities: EntityManager, private tagService: TagsService) {
        super(Note, entities)
    }

    async getFullTable() {
        let notesArr = await this.entities.find(this.entity, { relations: ["like", "tag"] })
        return notesArr
    }

    async getRow(id) {
        let notesRep = this.entities.getRepository(Note);
        return await notesRep.findOne(id, { relations: ["like", "tag"] })
    }

    async addTagToNote(id, tags) {
        let notesRep = this.entities.getRepository(Note);
        let noteEntity = await notesRep.findOne(id, { relations: ["tag"] });
        await this.tagService.addTag(tags, noteEntity)
        let resultEntity = await notesRep.findOne(id, { relations: ["tag"] });
        return resultEntity
    }

    async deleteTagsFromNote(id, tagName) {
        let notesRep = this.entities.getRepository(Note);
        let noteEntity = await notesRep.findOne(id, { relations: ["tag"] });
        noteEntity.tag = noteEntity.tag.filter(tag => tag.name != tagName)
        this.entities.save(noteEntity)
        let resultEntity = await notesRep.findOne(id, { relations: ["tag"] });
        return resultEntity
    }

    async getTags(id) {
        let notesRep = this.entities.getRepository(Note);
        let note = await notesRep.findOne(id, { relations: ["tag"]});
        return note.tag;
    }

    async addNoteFromUser(note, user) {
        await this.entities.save(this.entity, note)
        let isPresent = await this.entities.findOne(Note, { title: note.title })
        user.notes.push(isPresent)
        this.entities.save(user)
    }
}
