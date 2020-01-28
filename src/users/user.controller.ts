import { Controller, Get, Post, Body, Put, Param, Options, Header, Delete, Res, UseGuards } from '@nestjs/common';
import { UsersService } from './user.service';

@Controller('users')
export class UsersController {
    constructor(public userService: UsersService) { }

    @Options()
    @Header('Access-Control-Allow-Origin', '*')
    response() {
        console.log('one')
    }

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

}
