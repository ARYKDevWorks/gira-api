import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';

describe('ProjectsController', () => {
  let controller: ProjectsController;
  let crudService: DeepMocked<ClientProxy>;

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
});
