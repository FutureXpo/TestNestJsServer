import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './book.entity';
import { UserEntity } from '../user/user.entity';
import { BookService } from './book.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { TicketCheckMiddleware } from './ticket.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([BookEntity, UserEntity]), UserModule],
  providers: [BookService],
  controllers: [
    BookController
  ]
})
export class BookModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'books', method: RequestMethod.POST},
        {path: 'books/:slug', method: RequestMethod.DELETE},
        {path: 'books/:slug', method: RequestMethod.PUT},
        {path: 'books/:slug/take', method: RequestMethod.GET},
        {path: 'books/:slug/take', method: RequestMethod.DELETE});
	consumer
      .apply(TicketCheckMiddleware)
      .forRoutes(
        {path: 'books/:slug/take', method: RequestMethod.GET},
        {path: 'books/:slug/take', method: RequestMethod.DELETE});
  }
}
