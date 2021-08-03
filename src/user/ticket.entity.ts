import {Entity, PrimaryGeneratedColumn, Column, BeforeInsert, JoinTable, ManyToMany, ManyToOne} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('ticket')
export class TicketEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({default: 'basic'})
  type: string;
  
  @Column()
  startDate: string;

  @Column()
  endDate: string;

  @ManyToOne(type => UserEntity, user => user.ticket)
  owner: UserEntity;
  
}
