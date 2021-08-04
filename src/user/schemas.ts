let succsess_schema = {
	type: 'object',
	properties: {
		isSuccsess: {type: 'boolean', example: true, description: 'Is operation is succsess'},
		message: {type: 'string',  description: 'Some information, if isSuccsess=false'}
	}
}
let user_login_schema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				username: {type: 'string', example: 'example'},
				email: {type: 'string', example: 'example@mail.ru'},
				token: {type: 'string', example: 'SOMEAUTHTOKEN'}
			}
		}
	}
}
let user_logged_info_schema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				id: {type: 'integer', example: 0},
				username: {type: 'string', example: 'example'},
				email: {type: 'string', example: 'example@mail.ru'},
				token: {type: 'string', example: 'SOMEAUTHTOKEN'}
			}
		}
	}
}

let user_info_schema = {
	type: 'object',
	properties: {
		user: {
			type: 'object',
			properties: {
				id: {type: 'integer', example: 0},
				username: {type: 'string', example: 'example'},
				email: {type: 'string', example: 'example@mail.ru'},
				booksCount: {type: 'integer', example: 2}
			}
		}
	}
}
let users_schema = {
	type: 'array',
	items: user_info_schema.properties.user
}

let req_ticket_schema = {
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

let req_user_schema = {
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

let req_update_user_schema = {
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

let req_login_user_schema = {
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


let book_schema = {
	type: 'object',
	properties: {
		book: {
			type: 'object',
			properties: {
				id: {type: 'integer', example: 0},
				slug: {type: 'string', example: 'title-a21fdf2'},
				title: {type: 'string', example: 'Title'},
				description: {type: 'string', example: 'Some description'},
				body: {type: 'string', example: 'Some text'}
			}
		}
	}
};
let books_schema = {
	type: 'object',
	properties: {
		books: {
			type: 'array',
			items: book_schema.properties.book
		},
		booksCount: {type: 'integer', example: 1}
	}
};
let req_book_schema = {
	type: 'object',
	properties: {
		book: {
			type: 'object',
			properties: {
				title: {type: 'string', example: 'Title'},
				description: {type: 'string', example: 'Some description'},
				body: {type: 'string', example: 'Some text'}
			}
		}
	}
};

let profile_schema = {
	type: 'object',
	properties: {
		profile: {
			type: 'object',
			properties: {
				username: {type: 'string', example: 'example'},
				books: books_schema.properties.books
			}
		}
	}
}

let config = {
	succsess_schema : succsess_schema,
	user_login_schema : user_login_schema,
	user_logged_info_schema : user_logged_info_schema,
	user_info_schema : user_info_schema,
	users_schema : users_schema,
	req_ticket_schema : req_ticket_schema,
	req_user_schema : req_user_schema,
	req_update_user_schema : req_update_user_schema,
	req_login_user_schema : req_login_user_schema,
	book_schema : book_schema,
	books_schema : books_schema,
	req_book_schema : req_book_schema,
	profile_schema : profile_schema,
}
module.exports = config;