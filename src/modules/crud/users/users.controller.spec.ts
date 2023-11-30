import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { User } from './entities/user.entity';
import { faker } from '@faker-js/faker/locale/en';
import { validate } from 'class-validator';
import { firstValueFrom, of } from 'rxjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('Users Controller', () => {
  let controller: UsersController;
  let crudService: DeepMocked<ClientProxy>;
  const user = () => {
    const name = faker.person.fullName();
    return new User({
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
    });
  };

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

  describe('Create new user', () => {
    const newUser: User = user();
    const newUserDetails: CreateUserDto = {
      name: newUser.name,
      email: newUser.email,
      avatarUrl: newUser.avatarUrl,
      projectId: newUser.projectId,
    };
    it('should throw an error for invalid user details', async () => {
      const invalidUserDetails = {
        ...newUserDetails,
        email: faker.string.alphanumeric(),
        avatarUrl: faker.string.numeric(),
        projectId: faker.number.int(),
      };
      const invalidUserErrors = validate(invalidUserDetails);
      expect(invalidUserErrors).not.toBe([]);
    });

    it('should send a request to the CRUD service with user details', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(of(newUser));

      await controller.create(newUserDetails);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('createUser');
      expect(mockCrudService.mock.calls[0][1]).toBe(newUserDetails);
    });

    it('should return the User if creation is successful', async () => {
      crudService.send.mockReturnValueOnce(of(newUser));

      const createdUser: User = await firstValueFrom(
        await controller.create(newUserDetails),
      );
      expect(createdUser).toBeInstanceOf(User);
      expect(createdUser).toBe(newUser);
    });
  });

  describe('Get all users', () => {
    it('should fetch all users from the CRUD microservice', async () => {
      const userList = new Array(5).fill(null).map(() => user());
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(userList),
      );

      controller.findAll();
      const fetchedUsers: Array<User> = await firstValueFrom(
        mockCrudService.mock.results[0].value,
      );
      expect(fetchedUsers).toHaveLength(5);
      for (const user of fetchedUsers) {
        expect(user).toBeInstanceOf(User);
      }
    });
  });

  describe('Get User by email', () => {
    const userByEmail: User = user();

    it('should throw a error if the input is not in a valid email format', async () => {
      const invalidUserEmail: string = 'invalid_email';
      await expect(controller.remove(invalidUserEmail)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should send a request with the email address', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(userByEmail),
      );

      controller.findOne(userByEmail.email);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('findUser');
      expect(mockCrudService.mock.calls[0][1]).toBe(userByEmail.email);
    });

    it('should fetch only one user having the email', async () => {
      crudService.send.mockReturnValueOnce(of(userByEmail));

      const fetchedUser = await firstValueFrom(
        controller.findOne(userByEmail.email),
      );
      expect(fetchedUser).toBeInstanceOf(User);
      expect(fetchedUser).toBe(userByEmail);
    });

    it('should fetch no users if email not found', async () => {
      const nonExistentUserEmail: string = 'unknown@mail.com';
      crudService.send.mockReturnValueOnce(of([]));

      const fetchedUser = await firstValueFrom(
        controller.findOne(nonExistentUserEmail),
      );
      expect(fetchedUser).toStrictEqual([]);
    });
  });

  describe('Edit a user', () => {
    const userToBeEdited: User = user();
    const userEmail: string = userToBeEdited.email;
    const editedDetails: UpdateUserDto = {
      email: faker.internet.email(),
      avatarUrl: faker.internet.url(),
      projectId: faker.number.int({ max: 100 }),
    };
    const editedUser: User = { ...userToBeEdited, ...editedDetails };

    it('should throw an error for invalid user details', () => {
      const invalidUserDetails = {
        ...editedDetails,
        email: faker.string.alphanumeric(),
        avatarUrl: faker.string.numeric(),
        projectId: faker.number.int(),
      };
      const invalidUserErrors = validate(invalidUserDetails);
      expect(invalidUserErrors).not.toBe([]);
    });

    it('should send a request with the email and details to update', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(editedUser),
      );

      await controller.update(userEmail, editedDetails);
      const request: any = mockCrudService.mock.calls[0][1];
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('editUser');
      expect(request.email).toBe(userEmail);
      expect(request.updateUserDto).toBe(editedDetails);
    });

    it('should throw an error if the user with the given email is not found', async () => {
      const nonExistentUserEmail: string = 'unknown@mail.com';
      crudService.send.mockReturnValueOnce(of(0));

      await expect(
        controller.update(nonExistentUserEmail, editedDetails),
      ).rejects.toThrow(NotFoundException);
    });

    it('should fetch the user if update is successful', async () => {
      crudService.send.mockReturnValueOnce(of(editedUser));

      const fetchedUser: User = await controller.update(
        userEmail,
        editedDetails,
      );
      expect(fetchedUser).toBe(editedUser);
    });
  });

  describe('Delete a user', () => {
    const userToBeDeleted: User = user();
    const userEmail: string = userToBeDeleted.email;

    it('should throw a error if the input is not in a valid email format', async () => {
      const invalidUserEmail: string = 'invalid_email';
      await expect(controller.remove(invalidUserEmail)).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should send a request with the email of the user to be deleted', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(userToBeDeleted),
      );

      await controller.remove(userEmail);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('deleteUser');
      expect(mockCrudService.mock.calls[0][1]).toBe(userEmail);
    });

    it('should throw an error if the user with the given email is not found', async () => {
      const nonExistentUserEmail: string = 'unknown@mail.com';
      crudService.send.mockReturnValueOnce(of(0));

      await expect(controller.remove(nonExistentUserEmail)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should fetch the user if deletion is successful', async () => {
      crudService.send.mockReturnValueOnce(of(userToBeDeleted));

      const fetchedUser: User = await controller.remove(userEmail);
      expect(fetchedUser).toBe(userToBeDeleted);
    });
  });
});
