import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({ required: false, nullable: true })
  avatarUrl?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, nullable: true })
  projectId?: number | null;
}
