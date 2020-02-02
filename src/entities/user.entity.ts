import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Note } from "./note.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 20 })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  numberOfLatestLikes: number;

  @Column({ nullable: true })
  phoneNumber: number;

  @Column({ nullable: true })
  birthDate: string;

  @OneToMany(type => Note, note => note.user)
  notes: Note[];
}
