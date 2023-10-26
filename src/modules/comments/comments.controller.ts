import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { CommentEntity } from './entities/comment.entity';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiCreatedResponse({ type: CommentEntity })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return new CommentEntity(
      await this.commentsService.create(createCommentDto),
    );
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: CommentEntity })
  async update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return new CommentEntity(
      await this.commentsService.update(+id, updateCommentDto),
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: CommentEntity })
  async remove(@Param('id') id: string) {
    return new CommentEntity(await this.commentsService.remove(+id));
  }
}
