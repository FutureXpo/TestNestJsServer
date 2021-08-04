import {
	Get,
	Post,
	Body,
	Put,
	Delete,
	Query,
	Param,
	Controller
} from '@nestjs/common';
import {Request} from 'express';
import {BookService} from './book.service';
import {CreateBookDto} from './dto';
import {BooksRO, BookRO} from './book.interface';
import {User} from '../user/user.decorator';

import {
	ApiBearerAuth,
	ApiResponse,
	ApiOperation,
	ApiTags,
	ApiParam,
	ApiBody,
	ApiHeader
} from '@nestjs/swagger';

const { 
	succsess_schema,
	book_schema,
	books_schema,
	req_book_schema
} = require( '../user/schemas');

@ApiBearerAuth()
@ApiTags('books')
@Controller('books')
export class BookController {
	constructor(private readonly bookService: BookService) {}

	@ApiOperation({summary: 'Get all books'})
	@ApiResponse({
		status: 200,
		description: 'Information of all books.',
		schema: books_schema
	})
	@Get()
	async findAll(@Query() query): Promise<BooksRO> {
		return await this.bookService.findAll(query);
	}

	@ApiOperation({summary: 'Get information about the book'})
	@ApiParam({
		name: 'slug',
		type: 'String',
		description: 'URL address of the book',
		required: true
	})
	@ApiResponse({
		status: 200,
		description: 'Information of the book ',
		schema: book_schema
	})
	@ApiResponse({status: 404, description: 'Book not found.'})
	@Get(':slug')
	async findOne(@Param('slug') slug): Promise<BookRO> {
		return await this.bookService.findOne({slug});
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiBody({schema: req_book_schema })
	@ApiOperation({summary: 'Create book'})
	@ApiResponse({
		status: 201,
		description: 'The book has been successfully created.',
		schema: book_schema
	})
	@ApiResponse({status: 403, description: 'Forbidden.'})
	@Post()
	async create(
		@User('id') userId: number,
		@Body('book') bookData: CreateBookDto
	) {
		return this.bookService.create(userId, bookData);
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiBody({schema: req_book_schema })
	@ApiParam({
		name: 'slug',
		type: 'String',
		description: 'URL address of the book',
		required: true
	})
	@ApiOperation({summary: 'Update book'})
	@ApiResponse({
		status: 201,
		description: 'The book has been successfully updated.',
		schema: book_schema
	})
	@ApiResponse({status: 403, description: 'Forbidden.'})
	@ApiResponse({status: 404, description: 'Book not found.'})
	@Put(':slug')
	async update(@Param() params, @Body('book') bookData: CreateBookDto) {
		return this.bookService.update(params.slug, bookData);
	}

	@ApiParam({
		name: 'slug',
		type: 'String',
		description: 'URL address of the book',
		required: true
	})
	@ApiOperation({summary: 'Delete book'})
	@ApiResponse({
		status: 201,
		description: 'The book has been successfully deleted.'
	})
	@ApiResponse({status: 401, description: 'Unauthorized.'})
	@ApiResponse({status: 403, description: 'Forbidden.'})
	@ApiResponse({status: 404, description: 'Book not found.'})
	@Delete(':slug')
	async delete(@Param() params) {
		return this.bookService.delete(params.slug);
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiParam({
		name: 'slug',
		type: 'String',
		description: 'URL address of the book',
		required: true
	})
	@ApiOperation({summary: 'Take the book'})
	@ApiResponse({
		status: 201,
		description: 'The book has been successfully taken.',
		schema: succsess_schema
	})
	@ApiResponse({status: 401, description: 'Unauthorized.'})
	@ApiResponse({status: 403, description: 'Forbidden.'})
	@Get(':slug/take')
	async take(@User('id') userId: number, @Param('slug') slug) {
		return await this.bookService.take(userId, slug);
	}

	@ApiHeader({ name: 'Authorization', description: 'You need bearer authorization to use this method' })
	@ApiParam({
		name: 'slug',
		type: 'String',
		description: 'URL address of the book',
		required: true
	})
	@ApiOperation({summary: 'Return the book'})
	@ApiResponse({
		status: 201,
		description: 'The book has been successfully returned.', 
		schema: succsess_schema
	})
	@ApiResponse({status: 401, description: 'Unauthorized.'})
	@ApiResponse({status: 403, description: 'Forbidden.'})
	@Delete(':slug/take')
	async unTake(@User('id') userId: number, @Param('slug') slug) {
		return await this.bookService.unTake(userId, slug);
	}
}
