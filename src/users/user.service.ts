import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Service } from "../models";
import { User } from "../entities/user.entity";
import { EntityManager, getRepository } from "typeorm";
import { Note } from "../entities/note.entity";
import { NoteService } from "../notes//notes.service";
@Injectable()
export class UsersService extends Service {
  constructor (entities: EntityManager, private noteService: NoteService) {
    super(User, entities);
  }

  async sortingByRecentEntries (userId) {
    const rangeByLatestNotes = 10;
    const userRep = await getRepository(User);
    const userWithNotes = await userRep.findOne(userId, { relations: ["notes"] });
    if (userWithNotes.notes.length <= rangeByLatestNotes) {
      return userWithNotes.notes;
    } else {
      return userWithNotes.notes.filter((note, i) => {
        if (i >= userWithNotes.notes.length - rangeByLatestNotes) {
          return note;
        }
      });
    }
  }

  async listOfUniqueTags (userId) {
    const userRep = await getRepository(User);
    const userWithNotes = await userRep.findOne(userId, { relations: ["notes"] });
    const tagsByUser = userWithNotes.notes.map(async note => {
      const repNote = await getRepository(Note);
      const noteWuthTags = await repNote.findOne(note.id, { relations: ["tag"] });
      return noteWuthTags.tag;
    });
    const uniqueTags = await Promise.all(tagsByUser)
      .then(tags => {
        return tags.filter((tag, i) => {
          if (Object.keys(tag).length !== 0) {
            return tags.indexOf(tag) === i;
          };
        });
      });
    return uniqueTags;
  }

  assignmentOfRating (users, userId) {
    const coefficient = Math.floor(100 / Math.max.apply(null, users.map(user => user.allLikes)));
    const user = users.find(user => user.userId === userId);
    return user.allLikes * coefficient;
  }

  async ratingFromLikes (userId) {
    let users = await this.entities.find(this.entity, { relations: ["notes"] });
    users = users.map(async user => {
      const allLikesByUser = user.notes.map(async note => {
        const repNote = await getRepository(Note);
        const noteWithLike = await repNote.findOne(note.id, { relations: ["like"] });
        return noteWithLike.like;
      });
      const allLikes = await Promise.all(allLikesByUser)
        .then(likes => {
          const allLikesFromUser: any = likes
            .reduce((sum:any, current:any) => {
              return sum + current.length;
            }, 0);
          return { userId: user.id, allLikes: allLikesFromUser };
        });
      return allLikes;
    });
    const ratingFromUser = await Promise.all(users).then(t => this.assignmentOfRating(t, userId));
    return ratingFromUser;
  }

  async ratingFromLatestLikes (userId) {
    let users = await this.entities.find(this.entity, { relations: ["notes"] });
    users = users.map(async user => {
      const latestNotes = await this.sortingByRecentEntries(user.id);
      const latestNotesWithLikes = latestNotes.map(async note => {
        const repNote = await getRepository(Note);
        const noteWithLike = await repNote.findOne(note.id, { relations: ["like"] });
        return noteWithLike.like;
      });
      const allLikes = await Promise.all(latestNotesWithLikes)
        .then(likes => {
          const allLikesFromUser: any = likes
            .reduce((sum:any, current:any) => {
              return sum + current.length;
            }, 0);
          return { userId: user.id, allLikes: allLikesFromUser };
        });
      return allLikes;
    });
    const ratingFromUser = await Promise.all(users).then(t => this.assignmentOfRating(t, userId));
    return ratingFromUser;
  }

  async getNotes (id) {
    const userRep = await this.entities.getRepository(User);
    const user = await userRep.findOne(id, { relations: ["notes"] });
    return user.notes;
  }

  async addNoteFromUser (id, note) {
    const userRep = await this.entities.getRepository(User);
    const user = await userRep.findOne(id, { relations: ["notes"] });
    this.noteService.addNoteFromUser(note, user);
  }
}
