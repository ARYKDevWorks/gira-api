import { Comment } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '../../users/entities/user.entity';

export class CommentEntity implements Comment {
  constructor({ user, ...data }: Partial<CommentEntity>) {
    Object.assign(this, data);
    if (user) {
      this.user = new UserEntity(user);
    }
  }

  @ApiProperty()
  id: number;

  @ApiProperty()
  body: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  issueId: number;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: number;

  @ApiProperty({ type: UserEntity })
  user: UserEntity;
}
