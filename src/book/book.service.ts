import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository, getRepository, DeleteResult, IsNull} from "typeorm";
import {BookEntity} from "./book.entity";
import {UserEntity} from "../user/user.entity";
import {CreateBookDto} from "./dto";

import {BookRO, BooksRO} from "./book.interface";
const slug = require("slug");

@Injectable()
export class BookService {
	constructor(
		@InjectRepository(BookEntity)
		private readonly bookRepository: Repository<BookEntity>,
		@InjectRepository(UserEntity)
		private readonly userRepository: Repository<UserEntity>
	) {}

	async findAll(query): Promise<BooksRO> {
		const qb = await getRepository(BookEntity)
			.createQueryBuilder("book")
			.leftJoinAndSelect("book.owner", "owner");

		//qb.where("1 = 1");

		if ("owner" in query) {
			const owner = await this.userRepository.findOne({
				username: query.owner,
			});
			qb.andWhere("book.ownerId = :id", {id: owner.id});
		}

		qb.orderBy("book.id", "ASC");

		const booksCount = await qb.getCount();

		if ("limit" in query) {
			qb.limit(query.limit);
		}

		if ("offset" in query) {
			qb.offset(query.offset);
		}

		const books = await qb.getMany();
		for (var book of books) {
			if (book.owner) {
				delete book.owner.password;
				delete book.owner.email;
				delete book.owner.booksCount;
				delete book.owner.ticket;
			}
		}

		return {books, booksCount};
	}

	async findOne(where): Promise<BookRO> {
		const book = await this.bookRepository.findOne(where);
		return {book};
	}

	async take(id: number, slug: string) {
		let isSuccsess = false,
			message;
		let book = await this.bookRepository.findOne({
			where: {slug: slug},
			relations: ["owner"],
		});
		const user = await this.userRepository.findOne({
			where: {id: id},
			relations: ["books"],
		});

		var canTake = user.booksCount < 5;
		//if(user.books) canTake = canTake && (user.books.findIndex(_book => _book.id === book.id) < 0);
		if (!canTake) message = "You already have the maximum amount of books";
		if (book.owner) {
			canTake = false;
			if (book.owner.id === user.id)
				message = "The book has already been taken by you";
			else message = "The book has already been taken by another person";
		}

		if (canTake) {
			if (!user.books) user.books = [];
			user.books.push(book);
			user.booksCount++;

			await this.userRepository.save(user);
			delete user.books;
			book.owner = user;
			book = await this.bookRepository.save(book);
			isSuccsess = true;
		}

		if (book.owner) {
			delete book.owner.password;
			delete book.owner.email;
			delete book.owner.booksCount;
		}

		return {isSuccsess, message, book};
	}

	async unTake(id: number, slug: string) {
		let isSuccsess = false,
			message;
		let book = await this.bookRepository.findOne({
			where: {slug: slug},
			relations: ["owner"],
		});
		if (book.owner)
			if (book.owner.id === id) {
				const user = await this.userRepository.findOne({
					where: {id: id},
					relations: ["books"],
				});

				const deleteIndex = user.books.findIndex((_book) => _book.id === book.id);

				if (deleteIndex >= 0) {
					user.books.splice(deleteIndex, 1);
					user.booksCount--;
					delete book.owner;

					await this.userRepository.save(user);
					book = await this.bookRepository.save(book);
					isSuccsess = true;
				}
			} else message = "Book has another owner.";
		else message = "Book is already free to take.";
		return {isSuccsess, message, book};
	}

	async create(userId: number, bookData: CreateBookDto): Promise<BookEntity> {
		let book = new BookEntity();
		book.title = bookData.title;
		book.description = bookData.description;
		book.body = bookData.body;
		book.slug = this.slugify(bookData.title);
		const newBook = await this.bookRepository.save(book);
		return newBook;
	}

	async update(slug: string, bookData: any): Promise<BookRO> {
		let toUpdate = await this.bookRepository.findOne({slug: slug});
		let updated = Object.assign(toUpdate, bookData);
		const book = await this.bookRepository.save(updated);
		return {book};
	}

	async delete(slug: string): Promise<DeleteResult> {
		return await this.bookRepository.delete({slug: slug});
	}

	slugify(title: string) {
		return (
			slug(title, {lower: true}) +
			"-" +
			((Math.random() * Math.pow(36, 6)) | 0).toString(36)
		);
	}
}
