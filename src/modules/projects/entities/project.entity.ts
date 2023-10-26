import { $Enums, Project } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectEntity implements Project {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ required: false, nullable: true })
  url: string;

  @ApiProperty({ required: false, nullable: true })
  description: string;

  @ApiProperty()
  category: $Enums.ProjectCategory;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
