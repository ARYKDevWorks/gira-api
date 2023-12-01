import { ApiProperty } from '@nestjs/swagger';
import { ProjectCategory } from './project.enum';

export class Project {
  constructor(partial: Partial<Project>) {
    Object.assign(this, partial);
  }
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  url: string;

  @ApiProperty({ required: false, nullable: true })
  description: string;

  @ApiProperty()
  category: ProjectCategory;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
