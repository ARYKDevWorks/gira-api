import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { faker } from '@faker-js/faker/locale/en';
import { validate } from 'class-validator';
import { firstValueFrom, of } from 'rxjs';
import { NotFoundException } from '@nestjs/common';
import { Project } from './entities/project.entity';
import { ProjectCategory } from './entities/project.enum';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

describe('Projects Controller', () => {
  let controller: ProjectsController;
  let crudService: DeepMocked<ClientProxy>;
  const project = (): Project => {
    return new Project({
      id: faker.number.int(),
      name: faker.commerce.product(),
      url: faker.internet.url(),
      description: faker.lorem.paragraph(),
      category: ProjectCategory[faker.number.int({ max: 2 })],
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 20 }),
    });
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: 'CRUD_SERVICE',
          useValue: createMock<ClientProxy>(),
        },
      ],
    }).compile();

    crudService = module.get('CRUD_SERVICE');
    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create new project', () => {
    const newProject: Project = project();
    const newProjectDetails: CreateProjectDto = {
      name: faker.commerce.product(),
      url: faker.internet.url(),
      description: faker.lorem.paragraph(),
      category: ProjectCategory[faker.number.int({ max: 2 })],
    };
    it('should throw an error for invalid project details', async () => {
      const invalidProjectDetails = {
        url: faker.string.numeric(),
        category: 'Inv@lid',
      };
      const invalidProjectErrors = validate(invalidProjectDetails);
      expect(invalidProjectErrors).not.toBe([]);
    });

    it('should send a request to the CRUD service with project details', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(newProject),
      );

      await controller.create(newProjectDetails);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('createProject');
      expect(mockCrudService.mock.calls[0][1]).toBe(newProjectDetails);
    });

    it('should return the Project if creation is successful', async () => {
      crudService.send.mockReturnValueOnce(of(newProject));

      const createdProject: Project = await firstValueFrom(
        await controller.create(newProjectDetails),
      );
      expect(createdProject).toBeInstanceOf(Project);
      expect(createdProject).toBe(newProject);
    });
  });

  describe('Get all projects', () => {
    it('should send a request with the project ID', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(of(''));

      controller.findAll();
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('allProjects');
      expect(mockCrudService.mock.calls[0][1]).toStrictEqual({});
    });
    it('should fetch all projects from the CRUD microservice', async () => {
      const projectList = new Array(5).fill(null).map(() => project());
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(projectList),
      );

      controller.findAll();
      const fetchedProjects: Array<Project> = await firstValueFrom(
        mockCrudService.mock.results[0].value,
      );
      expect(fetchedProjects).toHaveLength(5);
      for (const project of fetchedProjects) {
        expect(project).toBeInstanceOf(Project);
      }
    });
  });

  describe('Get Project by ID', () => {
    const projectById: Project = project();

    it('should send a request with the project ID', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(projectById),
      );

      controller.findOne(projectById.id);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('findProject');
      expect(mockCrudService.mock.calls[0][1]).toBe(projectById.id);
    });

    it('should fetch only one project having the given ID', async () => {
      crudService.send.mockReturnValueOnce(of(projectById));

      const fetchedProject = await firstValueFrom(
        controller.findOne(projectById.id),
      );
      expect(fetchedProject).toBeInstanceOf(Project);
      expect(fetchedProject).toBe(projectById);
    });

    it('should fetch no projects if ID not found', async () => {
      const nonExistentProjectId: number = 9999999;
      crudService.send.mockReturnValueOnce(of([]));

      const fetchedProject = await firstValueFrom(
        controller.findOne(nonExistentProjectId),
      );
      expect(fetchedProject).toStrictEqual([]);
    });
  });

  describe('Edit a Project', () => {
    const projectToBeEdited: Project = project();
    const projectId: number = projectToBeEdited.id;
    const editedDetails: UpdateProjectDto = {
      name: faker.commerce.product(),
      url: faker.internet.url(),
      description: faker.lorem.paragraph(),
      category: ProjectCategory[faker.number.int({ max: 2 })],
    };
    const editedProject: Project = { ...projectToBeEdited, ...editedDetails };

    it('should throw an error for invalid project details', () => {
      const invalidProjectDetails = {
        ...editedDetails,
        url: faker.string.alphanumeric(),
        category: faker.string.alpha(),
      };
      const invalidProjectErrors = validate(invalidProjectDetails);
      expect(invalidProjectErrors).not.toBe([]);
    });

    it('should send a request with the project ID and details to update', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(editedProject),
      );

      await controller.update(projectId, editedDetails);
      const request: any = mockCrudService.mock.calls[0][1];
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('editProject');
      expect(request.id).toBe(projectId);
      expect(request.updateProjectDto).toBe(editedDetails);
    });

    it('should throw an error if the user with the given project ID is not found', async () => {
      const nonExistentProjectId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(
        controller.update(nonExistentProjectId, editedDetails),
      ).rejects.toThrow(NotFoundException);
    });

    it('should fetch the project if update is successful', async () => {
      crudService.send.mockReturnValueOnce(of(editedProject));

      const fetchedProject: Project = await controller.update(
        projectId,
        editedDetails,
      );
      expect(fetchedProject).toBe(editedProject);
    });
  });

  describe('Delete a project', () => {
    const projectToBeDeleted: Project = project();
    const projectId: number = projectToBeDeleted.id;

    it('should send a request with the ID of the project to be deleted', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(projectToBeDeleted),
      );

      await controller.remove(projectId);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('deleteProject');
      expect(mockCrudService.mock.calls[0][1]).toBe(projectId);
    });

    it('should throw an error if the project with the given ID is not found', async () => {
      const nonExistentProjectId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(controller.remove(nonExistentProjectId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should fetch the project if deletion is successful', async () => {
      crudService.send.mockReturnValueOnce(of(projectToBeDeleted));

      const fetchedUser: Project = await controller.remove(projectId);
      expect(fetchedUser).toBe(projectToBeDeleted);
    });
  });
});
