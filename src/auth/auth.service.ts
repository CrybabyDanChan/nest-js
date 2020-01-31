import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';

@Injectable()
export class AuthService {
  constructor( @InjectRepository(User) private UsersRep: Repository<User>) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.UsersRep.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}