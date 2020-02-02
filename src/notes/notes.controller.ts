import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from "@nestjs/common";
import { NoteService } from "./notes.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("notes")
export class NoteController {
  constructor (private noteService: NoteService) { }

    @Get()
  getNotes () {
    return this.noteService.getFullTable();
  }

    @Get(":id")
    getNote (@Param() params) {
      const id = params.id;
      return this.noteService.getRow(id);
    }

    @Get(":id/tags")
    getTags (@Param() params) {
      const id = params.id;
      return this.noteService.getTags(id);
    }

    @Post("add")
    addNote (@Body() data) {
      return this.noteService.addRow(data);
    }

    @UseGuards(AuthGuard("jwt"))
    @Put(":id/tags/add")
    addTagToNote (@Param() params, @Body() data, @Request() req) {
      const noteId = params.id;
      const tagName = data.name;
      this.noteService.addTagToNote(noteId, tagName, req.user);
    }

    @Delete(":id/tags/delete")
    deleteTagFromNote (@Param() params, @Body() data) {
      const id = params.id;
      const tagName = data.name;
      this.noteService.deleteTagsFromNote(id, tagName);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/likes/add")
    addLikeFromNote (@Param() params, @Request() req) {
      this.noteService.addLikeFromNote(params.id, req.user.userId);
    }
}
