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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { ClientProxy } from '@nestjs/microservices';

@Controller('projects')
@ApiTags('projects')
export class ProjectsController {
  constructor(@Inject('CRUD_SERVICE') private crudClient: ClientProxy) {}

  @Post()
  @ApiCreatedResponse({ type: Project })
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.crudClient.send({ cmd: 'createProject' }, createProjectDto);
  }

  @Get()
  @ApiOkResponse({ type: Project, isArray: true })
  findAll() {
    return this.crudClient.send({ cmd: 'allProjects' }, {});
  }

  @Get(':id')
  @ApiOkResponse({ type: Project })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.crudClient.send({ cmd: 'findProject' }, id);
  }

  @Patch(':id')
  @ApiCreatedResponse({ type: Project })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.crudClient.send(
      { cmd: 'editProject' },
      { id, updateProjectDto },
    );
  }

  @Delete(':id')
  @ApiOkResponse({ type: Project })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.crudClient.send({ cmd: 'deleteProject' }, id);
  }
}
