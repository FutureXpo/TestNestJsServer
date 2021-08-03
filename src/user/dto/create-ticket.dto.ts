import { ApiProperty } from '@nestjs/swagger';

export class CreateTicketDto {
  @ApiProperty()
  readonly type: string;
  
  @ApiProperty()
  readonly startDate: string;
  
  @ApiProperty()
  readonly endDate: string;
}