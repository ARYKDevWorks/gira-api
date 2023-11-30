import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';

describe('CommentsController', () => {
  let controller: CommentsController;
  let crudService: DeepMocked<ClientProxy>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: 'CRUD_SERVICE',
          useValue: createMock<ClientProxy>(),
        },
      ],
    }).compile();

    crudService = module.get('CRUD_SERVICE');
    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
