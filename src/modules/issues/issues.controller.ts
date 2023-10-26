import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { IssuesService } from './issues.service';
import { CreateIssueDto } from './dto/create-issue.dto';
import { UpdateIssueDto } from './dto/update-issue.dto';
import { IssueEntity } from './entities/issue.entity';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Post()
  @ApiCreatedResponse({ type: IssueEntity })
  async create(@Body() createIssueDto: CreateIssueDto) {
    return this.issuesService.create(createIssueDto);
  }

  @Get('/view/:issueId')
  @ApiOkResponse({ type: IssueEntity })
  async findOne(@Param('issueId') issueId: number) {
    return new IssueEntity(await this.issuesService.findOne(issueId));
  }

  @Get(':projectId')
  @ApiOkResponse({ type: IssueEntity, isArray: true })
  async findByProject(@Param('projectId') projectId: number) {
    const issues = await this.issuesService.findByProject(projectId);
    return issues.map((issue) => new IssueEntity(issue));
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: IssueEntity })
  update(@Param('id') id: string, @Body() updateIssueDto: UpdateIssueDto) {
    return this.issuesService.update(+id, updateIssueDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: IssueEntity })
  remove(@Param('id') id: string) {
    return this.issuesService.remove(+id);
  }
}
