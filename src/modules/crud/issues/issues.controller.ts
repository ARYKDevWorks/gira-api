import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Inject,
  ParseIntPipe,
  NotFoundException,
} from '@nestjs/common';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('issues')
@ApiTags('issues')
export class IssuesController {
  constructor(@Inject('CRUD_SERVICE') private crudClient: ClientProxy) {}

  @Post()
  @ApiCreatedResponse({ type: Issue })
  async create(@Body() createIssueDto: any) {
    return this.crudClient.send({ cmd: 'createIssue' }, createIssueDto);
  }

  @Get('/view/:issueId')
  @ApiOkResponse({ type: Issue })
  async findOne(@Param('issueId', ParseIntPipe) issueId: number) {
    return this.crudClient.send({ cmd: 'findIssue' }, issueId);
  }

  @Get(':projectId')
  @ApiOkResponse({ type: Issue, isArray: true })
  async findByProject(@Param('projectId', ParseIntPipe) projectId: number) {
    const issues = await firstValueFrom(
      this.crudClient.send({ cmd: 'findProjectIssues' }, projectId),
    );
    if (issues === 0) {
      throw new NotFoundException('Project not found');
    }
    return issues;
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Issue })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    const updatedIssue = await firstValueFrom(
      this.crudClient.send({ cmd: 'editIssue' }, { id, updateIssueDto }),
    );
    if (updatedIssue === 0) {
      throw new NotFoundException('Issue not found to update');
    }
    return updatedIssue;
  }

  @Delete(':id')
  @ApiOkResponse({ type: Issue })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedIssue = await firstValueFrom(
      this.crudClient.send({ cmd: 'deleteIssue' }, id),
    );
    if (deletedIssue === 0) {
      throw new NotFoundException('Issue not found to delete');
    }
    return deletedIssue;
  }
}
