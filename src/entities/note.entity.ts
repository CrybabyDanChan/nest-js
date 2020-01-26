import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from "./user.entity";

@Entity()
export class Note {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createDateTime: Date;

  @Column({type:'text', nullable: true, default: null})
  title: string;

  @Column({type:'text', nullable: true, default: null})
  text: string;

  @ManyToOne(type => User, user => user.notes)
  user: User;

  @ManyToMany(type => User)
  @JoinTable()
  like: User[];

}