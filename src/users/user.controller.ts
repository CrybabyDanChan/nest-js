import { Controller, Get, Post, Body, Put, Param, Options, Header, Delete, Res, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UsersController {
  constructor (public userService: UsersService) { }

    @Get(":id")
  getUser (@Param() params) {
    const id = params.id;
    return this.userService.getRow(id);
  }

    @Get()
    getUsers () {
      return this.userService.getFullTable();
    }

    @UseGuards(AuthGuard("jwt"))
    @Get(":id/notes")
    getUserPosts (@Param() params, @Request() req) {
      const id = params.id;
      return this.userService.getNotes(id);
    }

    @Post("register")
    addUser (@Body() user) {
      return this.userService.addRow(user);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("notes/add")
    addNoteFromUser (@Request() req, @Body() note) {
      const id = req.user.userId;
      return this.userService.addNoteFromUser(id, note);
    }
}
