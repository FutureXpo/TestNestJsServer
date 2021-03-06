import {
	Get,
	Post,
	Body,
	Put,
	Delete,
	Param,
	Controller,
	UsePipes
} from '@nestjs/common';
import {Request} from 'express';
import {UserService} from './user.service';
import {UserRO} from './user.interface';
import {
	CreateUserDto,
	UpdateUserDto,
	LoginUserDto,
	CreateTicketDto
} from './dto';
import {HttpException} from '@nestjs/common/exceptions/http.exception';
import {User} from './user.decorator';
import {ValidationPipe} from '../shared/pipes/validation.pipe';

import {
	ApiBearerAuth,
	ApiBody,
	ApiResponse,
	ApiTags,
	ApiOperation,
	ApiHeader
} from '@nestjs/swagger';

const { 
	succsess_schema,
	user_login_schema,
	user_logged_info_schema,
	user_info_schema,
	users_schema,
	req_ticket_schema,
	req_user_schema,
	req_update_user_schema,
	req_login_user_schema
} = require( './schemas');

@ApiBearerAuth()
@ApiTags('user')
@ApiTags('users')
@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({summary: 'Get all users'})
	@ApiResponse({status: 200, description: 'Users were returned', schema: users_schema})
	@Get('users')
	async findAll() {
		return await this.userService.findAll();
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiOperation({summary: 'Get info about logged in user'})
	@ApiResponse({status: 200, description: 'User has been returned', schema: user_logged_info_schema})
	@Get('user')
	async findMe(@User('email') email: string): Promise<UserRO> {
		return await this.userService.findByEmail(email);
	}
	
	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiBody({schema: req_update_user_schema })
	//@ApiBody({ type: UpdateUserDto })
	@ApiOperation({summary: 'Update user data'})
	@ApiResponse({status: 200, description: 'User has been updated'})
	@Put('user')
	async update(
		@User('id') userId: number,
		@Body('user') userData: UpdateUserDto
	) {
		return await this.userService.update(userId, userData);
	}
	
	@ApiBody({schema: req_user_schema })
	//@ApiBody({ type: CreateUserDto })
	@ApiOperation({summary: 'Create new user'})
	@ApiResponse({status: 201, description: 'User has been created'})
	@UsePipes(new ValidationPipe())
	@Post('user')
	async create(@Body('user') userData: CreateUserDto) {
		return this.userService.create(userData);
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiOperation({summary: 'Delete user'})
	@ApiResponse({status: 200, description: 'User has been deleted'})
	@Delete('user')
	async delete(@User('email') email: string) {
		return await this.userService.delete(email);
	}

	@ApiBody({schema: req_login_user_schema })
	@ApiOperation({summary: 'Authorize user'})
	@ApiResponse({status: 201, description: 'User has been authorized', schema: user_login_schema})
	@UsePipes(new ValidationPipe())
	@Post('users/login')
	async login(@Body('user') loginUserDto: LoginUserDto): Promise<UserRO> {
		const _user = await this.userService.findOne(loginUserDto);

		const errors = {User: ' not found'};
		if (!_user) throw new HttpException({errors}, 401);

		const token = await this.userService.generateJWT(_user);
		const {email, username} = _user;
		const user = {email, token, username};
		return {user};
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiBody({schema: req_ticket_schema })
	//@ApiBody({ type: CreateTicketDto })
	@ApiOperation({summary: 'Buy ticket'})
	@ApiResponse({status: 201, description: 'Ticket has been added to the user', schema: succsess_schema})
	@Post('user/ticket')
	async buyTicket(
		@User('id') userId: number,
		@Body('ticket') ticket: CreateTicketDto
	) {
		return await this.userService.buyTicket(userId, ticket);
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiOperation({summary: 'Sell ticket'})
	@ApiResponse({status: 200, description: 'Ticket was deleted from the user', schema: succsess_schema})
	@Delete('user/ticket')
	async sellTicket(@User('id') userId: number) {
		return await this.userService.sellTicket(userId);
	}
}
