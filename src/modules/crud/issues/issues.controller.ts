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
} from '@nestjs/common';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { Issue } from './entities/issue.entity';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ClientProxy } from '@nestjs/microservices';

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
    return this.crudClient.send({ cmd: 'findProjectIssues' }, projectId);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Issue })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIssueDto: UpdateIssueDto,
  ) {
    return this.crudClient.send({ cmd: 'editIssue' }, { id, updateIssueDto });
  }

  @Delete(':id')
  @ApiOkResponse({ type: Issue })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.crudClient.send({ cmd: 'deleteIssue' }, id);
  }
}
