import { ApiProperty } from '@nestjs/swagger';
import { ProjectCategory } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  @ApiProperty()
  name: string;

  @IsUrl()
  @ApiProperty({ required: false, nullable: true })
  url?: string;

  @IsString()
  @MaxLength(5000)
  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @IsNotEmpty()
  @IsEnum(ProjectCategory)
  @ApiProperty()
  category: ProjectCategory;
}
