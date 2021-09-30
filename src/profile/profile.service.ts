import { HttpStatus, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { ProfileRO, ProfileData } from './profile.interface';
import {HttpException} from "@nestjs/common/exceptions/http.exception";

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findProfile(username: string){
    const _profile = await this.userRepository.findOne({ where: { username: username }, relations: ['books','ticket'] })
	let isSuccsess = false;
	
    if(!_profile) return {isSuccsess};
	
	isSuccsess = true;
    let profile: ProfileData = {
      username: _profile.username,
	  books: _profile.books
    };

    return {isSuccsess,profile};
  }

}
