import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';


@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService) { }
    

    @Get()
    async getUsers() {
        return  await this.noteService.getFullTable() + '<a href="/">back</a>';
    }

    @Get(':id')
    getPost(@Param() params) {
        let id = params.id;
        return this.noteService.getRow(id);
    }

}