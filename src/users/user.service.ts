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

  sortingByRecentEntries (user, rangeFromNotes) {
    if (user.notes.length >= rangeFromNotes) {
      const interval = user.notes.length - rangeFromNotes;
      const filterNotes = user.notes.filter((us, i) => {
        if (i >= interval) {
          return i;
        }
      });
      user.lastNotes = filterNotes.concat();
    }
  }

  async listOfUniqueTags (user) {
    const tagsFromUser = user.notes.map(async us => {
      const rep = await getRepository(Note);
      const userWithTags = await rep.findOne(us.id, { relations: ["tag"] });
      const tagFromNote = { ...userWithTags.tag[0] };
      return tagFromNote;
    });
    await Promise.all(tagsFromUser).then(tags => {
      user.uniqueTags = tags.filter((tag, i) => {
        if (Object.keys(tag).length !== 0) {
          return tags.indexOf(tag) === i;
        }
      });
    });
  }

  async likesFromUser (user) {
    const allLikesFromUser = user.notes.map(async (note: any) => {
      const rep = await getRepository(Note);
      const noteWithLikes = await rep.findOne(note.id, { relations: ["like"] });
      return noteWithLikes.like.length;
    });
    await Promise.all(allLikesFromUser).then(t => {
      if (t.length) {
        const numberOfLikes = t.reduce((sum: any, current: any) => {
          return sum + current;
        });
        user.likes = numberOfLikes;
      }
    });
  }

  async ratingFromLikes (user: any) {
    const notes = await this.entities.find(Note, { relations: ["like"] });
    const numAllLikes = notes.reduce((sum: any, current: any) => {
      return sum + current.like.length;
    }, 0);
    const range = 100;
    const coefficientFoRating = range / numAllLikes;
    user.ratingFromLikes = user.likes * coefficientFoRating;
  }

  async latestLikesFromUser (user: any) {
    if (user.lastNotes) {
      const allLikesLatestFromUser = user.lastNotes.map(async (note: any) => {
        const rep = await getRepository(Note);
        const noteWithLikes = await rep.findOne(note.id, { relations: ["like"] });
        return noteWithLikes.like.length;
      });
      await Promise.all(allLikesLatestFromUser).then(likes => {
        const numberOfLikes = likes.reduce((sum:any, current:any) => sum + current);
        user.numberOfLatestLikes = numberOfLikes;
      });
      this.entities.save(user);
    }
  }

  async ratingByLikesForLatestNotes (user) {
    const userWithLatestLikes = await this.entities.find(User);
    const numAllLatestLikes = userWithLatestLikes.reduce((sum:any, current:any) => {
      return sum + current.numberOfLatestLikes;
    }, 0);
    const range = 100;
    const coefficientFoRating = range / numAllLatestLikes;
    user.ratingFromLikesAndLatestNotes = user.numberOfLatestLikes * coefficientFoRating;
  }

  async getFullTable () {
    let users = await this.entities.find(this.entity, { relations: ["notes"] });
    users = users.map(async user => {
      const rangeFromNotes = 10;
      this.sortingByRecentEntries(user, rangeFromNotes);
      await this.listOfUniqueTags(user);
      await this.likesFromUser(user);
      await this.ratingFromLikes(user);
      await this.latestLikesFromUser(user);
      await this.ratingByLikesForLatestNotes(user);
      return user;
    });
    const newUsers = await Promise.all(users);
    return newUsers;
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
