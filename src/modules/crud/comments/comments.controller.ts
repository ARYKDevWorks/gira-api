import {
  Body,
  Controller,
  Delete,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(@Inject('CRUD_SERVICE') private crudClient: ClientProxy) {}

  @Post()
  @ApiCreatedResponse({ type: Comment })
  async create(@Body() createCommentDto: CreateCommentDto) {
    return this.crudClient.send({ cmd: 'createComment' }, { createCommentDto });
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Comment })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.crudClient.send(
      { cmd: 'editComment' },
      { id: id, updateCommentDto },
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: Comment })
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.crudClient.send({ cmd: 'deleteComment' }, { id: id });
  }
}
