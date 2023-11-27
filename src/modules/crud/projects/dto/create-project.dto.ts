import { ApiProperty } from '@nestjs/swagger';
import { ProjectCategory } from '../entities/project.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
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

  @IsOptional()
  @IsUrl()
  @ApiProperty({ required: false, nullable: true })
  url?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @IsNotEmpty()
  @IsEnum(ProjectCategory)
  @ApiProperty()
  category: ProjectCategory;
}
