import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, MaxLength } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty()
  @MaxLength(10000)
  @ApiProperty()
  body: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  issueId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
}
