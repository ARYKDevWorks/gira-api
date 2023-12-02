import { Test, TestingModule } from '@nestjs/testing';
import { IssuesController } from './issues.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { Issue } from './entities/issue.entity';
import { faker } from '@faker-js/faker/locale/en';
import { IssuePriority, IssueStatus, IssueType } from './entities/issue.enum';
import { Project } from '../projects/entities/project.entity';
import { validate } from 'class-validator';
import { firstValueFrom, of } from 'rxjs';
import { CreateIssueDto } from './dto/create-issue.dto';
import { ProjectCategory } from '../projects/entities/project.enum';
import { NotFoundException } from '@nestjs/common';
import { UpdateIssueDto } from './dto/update-issue.dto';
describe('Issues Controller', () => {
  let controller: IssuesController;
  let crudService: DeepMocked<ClientProxy>;
  const issue = (projId: number | void): Issue => {
    const est = faker.number.int({ max: 20 });
    const spent = est - faker.number.int({ max: 20 });
    return new Issue({
      id: faker.number.int(),
      title: faker.lorem.sentence(5),
      type: IssueType[faker.number.int({ max: 2 })],
      status: IssueStatus[faker.number.int({ max: 3 })],
      priority: IssuePriority[faker.number.int({ max: 4 })],
      listPosition: faker.number.int({ max: 40 }),
      description: faker.lorem.paragraph(),
      descriptionText: faker.lorem.sentence(3),
      estimate: est,
      timeSpent: spent,
      timeRemaining: est - spent,
      projectId: projId ? projId : faker.number.int(),
      userId: faker.number.int(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 3 }),
    });
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IssuesController],
      providers: [
        {
          provide: 'CRUD_SERVICE',
          useValue: createMock<ClientProxy>(),
        },
      ],
    }).compile();

    crudService = module.get('CRUD_SERVICE');
    controller = module.get<IssuesController>(IssuesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create new issue', () => {
    const newIssue: Issue = issue();
    const est = faker.number.int({ max: 20 });
    const spent = est - faker.number.int({ max: 20 });
    const newIssueDetails: CreateIssueDto = {
      title: faker.lorem.sentence(5),
      type: IssueType[faker.number.int({ max: 2 })],
      status: IssueStatus[faker.number.int({ max: 3 })],
      priority: IssuePriority[faker.number.int({ max: 4 })],
      listPosition: faker.number.int({ max: 40 }),
      description: faker.lorem.paragraph(),
      descriptionText: faker.lorem.sentence(3),
      estimate: est,
      timeSpent: spent,
      timeRemaining: est - spent,
      projectId: faker.number.int(),
      userId: faker.number.int(),
    };
    it('should throw an error for invalid project details', async () => {
      const invalidIssueDetails = {
        type: faker.string.alpha(),
        status: faker.string.alpha(),
        priority: faker.string.alpha(),
      };
      const invalidProjectErrors = validate(invalidIssueDetails);
      expect(invalidProjectErrors).not.toBe([]);
    });

    it('should send a request to the CRUD service with issue details', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(newIssue),
      );

      await controller.create(newIssueDetails);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('createIssue');
      expect(mockCrudService.mock.calls[0][1]).toBe(newIssueDetails);
    });

    it('should return the Issue if creation is successful', async () => {
      crudService.send.mockReturnValueOnce(of(newIssue));

      const createdProject: Project = await firstValueFrom(
        await controller.create(newIssueDetails),
      );
      expect(createdProject).toBeInstanceOf(Issue);
      expect(createdProject).toBe(newIssue);
    });
  });

  describe('Get all issues of a project', () => {
    const project = new Project({
      id: faker.number.int(),
      name: faker.commerce.product(),
      url: faker.internet.url(),
      description: faker.lorem.paragraph(),
      category: ProjectCategory[faker.number.int({ max: 2 })],
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 20 }),
    });
    it('should send a request with the project ID', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(of(''));

      await controller.findByProject(project.id);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('findProjectIssues');
      expect(mockCrudService.mock.calls[0][1]).toStrictEqual(project.id);
    });
    it('should fetch all issues from the CRUD microservice', async () => {
      const issueList = new Array(5).fill(null).map(() => issue(project.id));
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(issueList),
      );

      await controller.findByProject(project.id);
      const fetchedIssues: Array<Issue> = await firstValueFrom(
        mockCrudService.mock.results[0].value,
      );
      expect(fetchedIssues).toHaveLength(5);
      for (const issue of fetchedIssues) {
        expect(issue).toBeInstanceOf(Issue);
      }
    });
    it('should throw an error if the project with the given ID is not found', async () => {
      const nonExistentProjectId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(
        controller.findByProject(nonExistentProjectId),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Get issue by ID', () => {
    const issueById: Issue = issue();

    it('should send a request with the issue ID', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(issueById),
      );

      await controller.findOne(issueById.id);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('findIssue');
      expect(mockCrudService.mock.calls[0][1]).toBe(issueById.id);
    });

    it('should fetch only one issue having the given ID', async () => {
      crudService.send.mockReturnValueOnce(of(issueById));

      const fetchedIssue = await firstValueFrom(
        await controller.findOne(issueById.id),
      );
      expect(fetchedIssue).toBeInstanceOf(Issue);
      expect(fetchedIssue).toBe(issueById);
    });

    it('should fetch no issues if ID not found', async () => {
      const nonExistentIssueId: number = 9999999;
      crudService.send.mockReturnValueOnce(of([]));

      const fetchedProject = await firstValueFrom(
        await controller.findOne(nonExistentIssueId),
      );
      expect(fetchedProject).toStrictEqual([]);
    });
  });

  describe('Edit an Issue', () => {
    const issueToBeEdited: Issue = issue();
    const issueId: number = issueToBeEdited.id;
    const editedDetails: UpdateIssueDto = {
      title: faker.lorem.sentence(5),
      type: IssueType[faker.number.int({ max: 2 })],
      status: IssueStatus[faker.number.int({ max: 3 })],
      priority: IssuePriority[faker.number.int({ max: 4 })],
      listPosition: faker.number.int({ max: 40 }),
      description: faker.lorem.paragraph(),
    };
    const editedIssue: Issue = { ...issueToBeEdited, ...editedDetails };

    it('should throw an error for invalid issue details', () => {
      const invalidIssueDetails = {
        ...editedDetails,
        type: faker.string.alpha(),
        status: faker.string.alpha(),
        priority: faker.string.alpha(),
      };
      const invalidProjectErrors = validate(invalidIssueDetails);
      expect(invalidProjectErrors).not.toBe([]);
    });

    it('should send a request with the issue ID and details to update', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(editedIssue),
      );

      await controller.update(issueId, editedDetails);
      const request: any = mockCrudService.mock.calls[0][1];
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('editIssue');
      expect(request.id).toBe(issueId);
      expect(request.updateIssueDto).toBe(editedDetails);
    });

    it('should throw an error if the issue with the given ID is not found', async () => {
      const nonExistentIssueId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(
        controller.update(nonExistentIssueId, editedDetails),
      ).rejects.toThrow(NotFoundException);
    });

    it('should fetch the issue if update is successful', async () => {
      crudService.send.mockReturnValueOnce(of(editedIssue));

      const fetchedIssue: Issue = await controller.update(
        issueId,
        editedDetails,
      );
      expect(fetchedIssue).toBe(editedIssue);
    });
  });

  describe('Delete an issue', () => {
    const issueToBeDeleted: Issue = issue();
    const issueId: number = issueToBeDeleted.id;

    it('should send a request with the ID of the issue to be deleted', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(issueToBeDeleted),
      );

      await controller.remove(issueId);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('deleteIssue');
      expect(mockCrudService.mock.calls[0][1]).toBe(issueId);
    });

    it('should throw an error if the issue with the given ID is not found', async () => {
      const nonExistentIssueId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(controller.remove(nonExistentIssueId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should fetch the issue if deletion is successful', async () => {
      crudService.send.mockReturnValueOnce(of(issueToBeDeleted));

      const fetchedIssue: Issue = await controller.remove(issueId);
      expect(fetchedIssue).toBe(issueToBeDeleted);
    });
  });
});
