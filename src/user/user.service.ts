import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository, getRepository, DeleteResult} from 'typeorm';
import {UserEntity} from './user.entity';
import {TicketEntity} from './ticket.entity';
import {
	CreateUserDto,
	LoginUserDto,
	UpdateUserDto,
	CreateTicketDto
} from './dto';
const jwt = require('jsonwebtoken');
import {SECRET} from '../config';
import {UserRO} from './user.interface';
import {validate} from 'class-validator';
import {HttpException} from '@nestjs/common/exceptions/http.exception';
import {HttpStatus} from '@nestjs/common';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>,
		@InjectRepository(TicketEntity)
		private readonly ticketRepository: Repository<TicketEntity>
	) {}

	async findAll(): Promise<UserEntity[]> {
		let users = await this.userRepository.find();
		for (var user of users) {
			delete user.password;
		}
		return users;
	}

	async findOne({email, password}: LoginUserDto): Promise<UserEntity> {
		const user = await this.userRepository.findOne({email});
		if (!user) {
			return null;
		}

		if (await argon2.verify(user.password, password)) {
			return user;
		}

		return null;
	}

	async create(dto: CreateUserDto): Promise<UserRO> {
		// check uniqueness of username/email
		const {username, email, password} = dto;
		const qb = await getRepository(UserEntity)
			.createQueryBuilder('user')
			.where('user.username = :username', {username})
			.orWhere('user.email = :email', {email});

		const user = await qb.getOne();

		if (user) {
			const errors = {username: 'Username and email must be unique.'};
			throw new HttpException(
				{message: 'Input data validation failed', errors},
				HttpStatus.BAD_REQUEST
			);
		}

		// create new user
		let newUser = new UserEntity();
		newUser.username = username;
		newUser.email = email;
		newUser.password = password;
		newUser.books = [];

		const errors = await validate(newUser);
		if (errors.length > 0) {
			const _errors = {username: 'Userinput is not valid.'};
			throw new HttpException(
				{message: 'Input data validation failed', _errors},
				HttpStatus.BAD_REQUEST
			);
		} else {
			const savedUser = await this.userRepository.save(newUser);
			return this.buildUserRO(savedUser);
		}
	}

	async update(id: number, dto: UpdateUserDto): Promise<UserEntity> {
		let toUpdate = await this.userRepository.findOne(id);
		delete toUpdate.password;
		delete toUpdate.books;

		let updated = Object.assign(toUpdate, dto);
		return await this.userRepository.save(updated);
	}

	async delete(email: string): Promise<DeleteResult> {
		let user = await this.userRepository.findOne({
			where: {email: email},
			relations: ['ticket']
		});
		if(user.ticket)
			await this.ticketRepository.delete({id: user.ticket.id});
		return await this.userRepository.delete({email: email});
	}

	async buyTicket(id: number, ticketData: CreateTicketDto) {
		const user = await this.userRepository.findOne({
			where: {id: id},
			relations: ['ticket']
		});
		let isSuccsess = true,
			message;
		if (!user.ticket) {
			let ticket = new TicketEntity();
			if (ticketData) {
				ticket.type = ticketData.type;
				let now = new Date(parseInt(ticketData.startDate));
				ticket.startDate = (ticketData.startDate || now.getTime()).toString();
				now.setDate(now.getDate() + 1);
				ticket.endDate = (ticketData.endDate || now.getTime()).toString();
				ticket.owner = user;
			} else {
				let now = new Date();
				ticket.startDate = now.getTime().toString();
				now.setDate(now.getDate() + 1);
				ticket.endDate = now.getTime().toString();
			}
			ticket = await this.ticketRepository.save(ticket);
			user.ticket = ticket;
			await this.userRepository.save(user);
		} else {
			isSuccsess = false;
			message = 'You have already bought the ticket';
		}
		return {isSuccsess, message};
	}

	async sellTicket(id: number) {
		const user = await this.userRepository.findOne({
			where: {id: id},
			relations: ['ticket']
		});
		let isSuccsess = true,
			message;
		if (user.ticket) {
			this.ticketRepository.delete({id: user.ticket.id});
		} else {
			isSuccsess = false;
			message = 'You have no ticket to sell';
		}
		return {isSuccsess, message};
	}

	async findById(id: number): Promise<UserRO> {
		const user = await this.userRepository.findOne({
			where: {id: id},
			relations: ['ticket', 'books']
		});

		if (!user) {
			const errors = {User: ' не найден'};
			throw new HttpException({errors}, 401);
		}

		return this.buildUserRO(user);
	}

	async findByEmail(email: string): Promise<UserRO> {
		const user = await this.userRepository.findOne({email: email});
		return this.buildUserRO(user);
	}

	public generateJWT(user) {
		let today = new Date();
		let exp = new Date(today);
		exp.setDate(today.getDate() + 60);

		return jwt.sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
				exp: exp.getTime() / 1000
			},
			SECRET
		);
	}

	private buildUserRO(user: UserEntity) {
		const userRO = {
			id: user.id,
			username: user.username,
			email: user.email,
			ticket: user.ticket,
			//books: user.books,
			token: this.generateJWT(user)
		};

		return {user: userRO};
	}
}
