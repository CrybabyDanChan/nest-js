import { Controller, Get } from "@nestjs/common";
import { TagsService } from "./tags.service";

@Controller("tags")
export class TagsController {
  constructor (public tagsService: TagsService) {}

    @Get()
  getUsers () {
    return this.tagsService.getFullTable();
  }
}
