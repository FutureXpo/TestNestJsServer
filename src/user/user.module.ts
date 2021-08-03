import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { TicketEntity } from './ticket.entity';
import { UserService } from './user.service';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, TicketEntity])],
  providers: [UserService],
  controllers: [
    UserController
  ],
  exports: [UserService]
})
export class UserModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
	  {path: 'user', method: RequestMethod.GET}, 
	  {path: 'user', method: RequestMethod.PUT}, 
	  {path: 'user', method: RequestMethod.DELETE}, 
	  //{path: 'users', method: RequestMethod.GET},
	  {path: 'user/ticket', method: RequestMethod.POST}, 
	  {path: 'user/ticket', method: RequestMethod.DELETE});
  }
}
