import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Tag } from 'src/entities/tags.entity';

@Injectable()
export class TagsService {
    constructor(private entities: EntityManager) { }

    async addTag(tags) {
        let tagsPromisesArray = tags.map(async tag => {
            let isPresent = await this.entities.findOne(Tag, { name: tag });
            if (!isPresent) {
                let tagEntity = new Tag();
                tagEntity.name = tag;
                await this.entities.save(tagEntity);
                return 'done'
            }
            return 'done'
        })
        let results = Promise.all(tagsPromisesArray)
        return results;
    }
}
