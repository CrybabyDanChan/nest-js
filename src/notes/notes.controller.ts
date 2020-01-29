import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { NoteService } from './notes.service';


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

    @Get(':id/tags')
    getTags(@Param() params) {
        let id = params.id;
        return this.noteService.getTags(id);
    }

    @Post()
    addNote(@Body() data) {
        return this.noteService.addRow(data);
    } 

    // @Put(':id/addtag')
    // addTagToNote(@Param() params, @Query() data) {
    //     let id = params.id;
    //     let tagsArray = data.tags.split(',');
    //     this.noteService.addTagToNote(id, tagsArray);       
    // }
}