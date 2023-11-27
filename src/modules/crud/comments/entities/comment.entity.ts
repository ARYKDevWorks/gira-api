import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

export class Comment {
  constructor({ user, ...data }: Partial<Comment>) {
    Object.assign(this, data);
    if (user) {
      this.user = new User(user);
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

  @ApiProperty({ type: User })
  user: User;
}
