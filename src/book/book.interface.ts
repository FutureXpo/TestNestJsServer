import { UserData } from '../user/user.interface';
import { BookEntity } from './book.entity';
import { ApiModel, ApiProperty } from '@nestjs/swagger';

//@ApiModel
interface BookData {
  //@ApiModelProperty
  slug: string;
  
  //@ApiModelProperty
  title: string;
  
  //@ApiModelProperty
  description: string;
  
  //@ApiModelProperty
  body?: string;
  
  //@ApiModelProperty
  owner?: UserData;
}

//@ApiModel
export interface BookRO {
  //@ApiModelProperty
  book: BookEntity;
}

//@ApiModel
export interface BooksRO {
  //@ApiModelProperty
  books: BookEntity[];
  
  //@ApiModelProperty
  booksCount: number;
}

