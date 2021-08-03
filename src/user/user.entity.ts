import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, OneToMany, OneToOne} from 'typeorm';
import { IsEmail } from 'class-validator';
import * as argon2 from 'argon2';
import { BookEntity } from '../book/book.entity';
import { TicketEntity } from './ticket.entity';

@Entity('user')
export class UserEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await argon2.hash(this.password);
  }

  @OneToMany(type => BookEntity, book => book.owner)
  books: BookEntity[];
  
  @Column({default: 0})
  booksCount: number;
  
  @OneToOne(type => TicketEntity, ticket => ticket.owner)
  ticket: TicketEntity;
  
}
