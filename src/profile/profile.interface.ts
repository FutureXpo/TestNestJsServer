import { BookEntity } from '../book/book.entity';

export interface ProfileData {
  username: string;
  books:BookEntity[];
}

export interface ProfileRO {
  profile: ProfileData;
}