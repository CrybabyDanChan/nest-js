import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHello (): string {
    return "<a href=\"/users\">users</a> <a href=\"/notes\">notes</a>";
  }
}
