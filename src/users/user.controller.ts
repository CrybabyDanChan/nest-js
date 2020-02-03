import { Controller, Get, Post, Body, Put, Param, UseGuards, Request } from "@nestjs/common";
import { UsersService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export class UsersController {
  // eslint-disable-next-line no-useless-constructor
  constructor (public userService: UsersService) { }

  @UseGuards(AuthGuard("jwt"))
  @Get("recentEntries")
  getRecentEntries (@Request() req) {
    const userId = req.user.userId;
    return this.userService.sortingByRecentEntries(userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("uniqueTags")
  getUniqueTags (@Request() req) {
    const userId = req.user.userId;
    return this.userService.listOfUniqueTags(userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("rating-by-likes")
  ratingFromLikes (@Request() req) {
    const userId = req.user.userId;
    return this.userService.ratingFromLikes(userId);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get("rating-by-latest-likes")
  ratingFromLatestLikes (@Request() req) {
    const userId = req.user.userId;
    return this.userService.ratingFromLatestLikes(userId);
  }

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
