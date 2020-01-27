import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NoteService } from './note.service';


@Controller('notes')
export class NoteController {
    constructor(private noteService: NoteService) { }
    

    @Get()
    async getUsers() {
        return  await this.noteService.getFullTable();
    }

    @Get(':id')
    getPost(@Param() params) {
        let id = params.id;
        return this.noteService.getRow(id);
    }

    @Post()
    addPost(@Body() data) {
        return this.noteService.addRow(data);
    } 


}