import {MiddlewareConsumer, Module, NestModule, RequestMethod} from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfileService } from './profile.service';
import { UserModule } from '../user/user.module';
import { UserEntity } from "../user/user.entity";

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [ProfileService],
  controllers: [
    ProfileController
  ],
  exports: []
})
export class ProfileModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
	  
  }
}
