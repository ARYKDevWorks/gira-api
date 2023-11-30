import {
  Body,
  Controller,
  Delete,
  Inject,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Comment } from './entities/comment.entity';
import { firstValueFrom } from 'rxjs';

@Controller('comments')
@ApiTags('comments')
export class CommentsController {
  constructor(@Inject('CRUD_SERVICE') private crudClient: ClientProxy) {}

  @Post()
  @ApiCreatedResponse({ type: Comment })
  async create(@Body() createCommentDto: any) {
    return this.crudClient.send({ cmd: 'createComment' }, createCommentDto);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Comment })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    const updatedComment = await firstValueFrom(
      this.crudClient.send({ cmd: 'editComment' }, { id, updateCommentDto }),
    );
    if (updatedComment === 0) {
      throw new NotFoundException('Issue not found to delete');
    }
    return updatedComment;
  }

  @Delete(':id')
  @ApiOkResponse({ type: Comment })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedComment = await firstValueFrom(
      this.crudClient.send({ cmd: 'deleteComment' }, id),
    );
    if (deletedComment === 0) {
      throw new NotFoundException('Issue not found to delete');
    }
    return deletedComment;
  }
}
