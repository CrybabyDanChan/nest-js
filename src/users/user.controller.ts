import { Controller, Get, Post, Body, Put, Param, Options, Header, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(public userService: UsersService) { }

    @Get(':id')
    getUser(@Param() params) {
        let id = params.id;
        return this.userService.getRow(id);
    }

    @Get()
    getUsers() {
        return this.userService.getFullTable();
    }

    @Get(':id/notes')
    getUserPosts(@Param() params) {
        let id = params.id;
        return this.userService.getNotes(id);
    }

    @Post('register')
    addUser(@Body() user) {
        return this.userService.addRow(user);
    }

    @Post(':id/notes/add')
    addNoteFromUser(@Param() params, @Body() note) {
        let id = params.id
        return this.userService.addNoteFromUser(id,note);
    }

}
