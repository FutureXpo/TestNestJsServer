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
	ApiOperation
} from '@nestjs/swagger';

const req_ticket_schema = {
	type: 'object',
	properties: {
		ticket: {
			type: 'object',
			properties: {
				type: {type: 'string', example: 'basic'},
				startDate: {type: 'number', example: 1627904902635},
				endDate: {type: 'number', example: 1627991302635},
			}
		}
	}
};

const req_user_schema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				username: {type: 'string', example: 'example'},
				email: {type: 'string', example: 'example@mail.ru'},
				password: {type: 'string', example: 'asfaidbgfoaub21'},
			}
		}
	}
};

const req_update_user_schema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				username: {type: 'string', example: 'example'},
				email: {type: 'string', example: 'example@mail.ru'}
			}
		}
	}
};

const req_login_user_schema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				email: {type: 'string', example: 'example@mail.ru'},
				password: {type: 'string', example: 'asfaidbgfoaub21'},
			}
		}
	}
};

@ApiBearerAuth()
@ApiTags('user')
@ApiTags('users')
@Controller()
export class UserController {
	constructor(private readonly userService: UserService) {}

	@ApiOperation({summary: 'Get all users'})
	@ApiResponse({status: 200, description: 'Users were returned'})
	@Get('users')
	async findAll() {
		return await this.userService.findAll();
	}

	@ApiOperation({summary: 'Get info about logged in user'})
	@ApiResponse({status: 200, description: 'User has been returned'})
	@Get('user')
	async findMe(@User('email') email: string): Promise<UserRO> {
		return await this.userService.findByEmail(email);
	}
	
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

	@ApiOperation({summary: 'Delete user'})
	@ApiResponse({status: 200, description: 'User has been deleted'})
	@Delete('user')
	async delete(@User('email') email: string) {
		return await this.userService.delete(email);
	}

	@ApiBody({schema: req_login_user_schema })
	@ApiOperation({summary: 'Authorize user'})
	@ApiResponse({status: 201, description: 'User has been authorized'})
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

	@ApiBody({schema: req_ticket_schema })
	//@ApiBody({ type: CreateTicketDto })
	@ApiOperation({summary: 'Buy ticket'})
	@ApiResponse({status: 201, description: 'Ticket has been added to the user'})
	@Post('user/ticket')
	async buyTicket(
		@User('id') userId: number,
		@Body('ticket') ticket: CreateTicketDto
	) {
		return await this.userService.buyTicket(userId, ticket);
	}

	@ApiOperation({summary: 'Sell ticket'})
	@ApiResponse({status: 201, description: 'Ticket was deleted from the user'})
	@Delete('user/ticket')
	async sellTicket(@User('id') userId: number) {
		return await this.userService.sellTicket(userId);
	}
}
