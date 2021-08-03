import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty()
  @IsNotEmpty()
  readonly title: string;
  
  @ApiProperty()
  @IsNotEmpty()
  readonly description: string;
  
  @ApiProperty()
  readonly body: string;
}
