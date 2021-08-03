import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestMiddleware, HttpStatus, Injectable } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UserService } from '../user/user.service';

@Injectable()
export class TicketCheckMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}

  async use(req: Request, res: Response, next: NextFunction) {
	if (!req.user.ticket) {
        throw new HttpException('User has no ticket to use books.', HttpStatus.FORBIDDEN);
	}
	else{
		console.log(req.user.ticket.startDate)
	}
	next();
  }
}
