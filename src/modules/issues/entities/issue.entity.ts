import { $Enums, Issue, IssueType } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';
import { CommentEntity } from '../../comments/entities/comment.entity';

export class IssueEntity implements Issue {
  constructor({ user, ...data }: Partial<IssueEntity>) {
    Object.assign(this, data);
    if (user) {
      this.user = new UserEntity(user);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  type: $Enums.IssueType;

  @ApiProperty()
  status: $Enums.IssueStatus;

  @ApiProperty()
  priority: $Enums.IssuePriority;

  @ApiProperty()
  listPosition: number;

  @ApiProperty({ required: false, nullable: true })
  description: string;

  @ApiProperty({ required: false, nullable: true })
  descriptionText: string;

  @ApiProperty({ required: false, nullable: true })
  estimate: number;

  @ApiProperty({ required: false, nullable: true })
  timeSpent: number;

  @ApiProperty({ required: false, nullable: true })
  timeRemaining: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  projectId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty({ required: false, type: UserEntity })
  user: UserEntity;
}
