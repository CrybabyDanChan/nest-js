import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { Service } from "../models";
import { User } from "../entities/user.entity";
import { EntityManager } from "typeorm";
import { Note } from "../entities/note.entity";
import { NoteService } from "../notes//notes.service";

@Injectable()
export class UsersService extends Service {
  constructor (entities: EntityManager, private noteService: NoteService) {
    super(User, entities);
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
