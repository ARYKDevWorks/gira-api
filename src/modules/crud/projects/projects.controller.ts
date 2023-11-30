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
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Project } from './entities/project.entity';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

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
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    const updatedProject = await firstValueFrom(
      this.crudClient.send({ cmd: 'editProject' }, { id, updateProjectDto }),
    );
    if (updatedProject === 0) {
      throw new NotFoundException('Project not found to update');
    }
    return updatedProject;
  }

  @Delete(':id')
  @ApiOkResponse({ type: Project })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const deletedProject = await firstValueFrom(
      this.crudClient.send({ cmd: 'deleteProject' }, id),
    );
    if (deletedProject === 0) {
      throw new NotFoundException('Project not found to update');
    }
    return deletedProject;
  }
}
