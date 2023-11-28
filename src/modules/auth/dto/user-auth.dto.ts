import { IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserAuthDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsStrongPassword({ minLength: 7 })
  @ApiProperty()
  pass: string;
}
