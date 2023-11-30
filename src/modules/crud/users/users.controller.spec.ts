import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker/locale/en';

describe('Users Controller', () => {
  let controller: UsersController;
  let crudService: DeepMocked<ClientProxy>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: 'CRUD_SERVICE',
          useValue: createMock<ClientProxy>(),
        },
      ],
    }).compile();

    crudService = module.get('CRUD_SERVICE');
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Get all users', () => {
    it('should fetch all users from the CRUD microservice', () => {});
  });

  describe('Get User by email', () => {
    const name = faker.person.fullName();
    const userByEmail: User = {
      id: faker.number.int(),
      name: name,
      email: faker.internet.email({
        firstName: name.split(' ')[0],
        lastName: name.split(' ')[1],
      }),
      avatarUrl: faker.internet.url(),
      createdAt: faker.date.past({ years: 2 }),
      updatedAt: faker.date.recent({ days: 20 }),
      projectId: faker.number.int({ max: 100 }),
    };
    it('should throw a error if the input is not in a valid email format', () => {});
    it('should send a request with the email address', () => {});
    it('should fetch only one user having the email', () => {});
    it('should have response HTTP status 200 when user is found', () => {});
    it('should fetch no users if email not found', () => {});
    it('should have response HTTP status 200 & message saying "User Not Found" when email not found', () => {});
  });
});
