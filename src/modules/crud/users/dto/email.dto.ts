import { IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EmailDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
