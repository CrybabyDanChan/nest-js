import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Tag } from 'src/entities/tags.entity';
import { Service } from 'src/models';

@Injectable()
export class TagsService extends Service {
    constructor(entities: EntityManager) {
        super(Tag, entities)
    }
    async addTag(tagName, noteEntity) {
        let isPresent = await this.entities.findOne(Tag, { name: tagName });
        let tagIsPresent = noteEntity.tag.find(tagEnt => tagEnt.name === tagName);
        if(!isPresent && !tagIsPresent) {
            let tagEntity = new Tag();
            tagEntity.name = tagName;
            await this.entities.save(tagEntity)
            noteEntity.tag.push(tagEntity);
            await this.entities.save(noteEntity)
        } else if(isPresent && !tagIsPresent) {
            noteEntity.tag.push(isPresent);
            await this.entities.save(noteEntity)
        }
        return 'done'
    }
}
