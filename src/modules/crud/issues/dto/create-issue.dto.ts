import { ApiProperty } from '@nestjs/swagger';
import { IssuePriority, IssueStatus, IssueType } from '../entities/issue.enum';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateIssueDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsEnum(IssueType)
  @ApiProperty()
  type: IssueType;

  @IsNotEmpty()
  @IsEnum(IssueStatus)
  @ApiProperty()
  status: IssueStatus;

  @IsNotEmpty()
  @IsEnum(IssuePriority)
  @ApiProperty()
  priority: IssuePriority;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  listPosition: number;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  description?: string;

  @IsString()
  @ApiProperty({ required: false, nullable: true })
  descriptionText?: string;

  @IsNumber()
  @ApiProperty({ required: false, nullable: true })
  estimate?: number;

  @IsNumber()
  @ApiProperty({ required: false, nullable: true })
  timeSpent?: number;

  @IsNumber()
  @ApiProperty({ required: false, nullable: true })
  timeRemaining?: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  projectId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;
}
