import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ClientProxy } from '@nestjs/microservices';
import { faker } from '@faker-js/faker/locale/en';
import { Comment } from './entities/comment.entity';
import { validate } from 'class-validator';
import { firstValueFrom, of } from 'rxjs';
import { CreateCommentDto } from './dto/create-comment.dto';
import { NotFoundException } from '@nestjs/common';
import { UpdateCommentDto } from './dto/update-comment.dto';

describe('Comments Controller', () => {
  let controller: CommentsController;
  let crudService: DeepMocked<ClientProxy>;
  const comment = () => {
    return new Comment({
      id: faker.number.int(),
      body: faker.lorem.paragraph({ min: 3, max: 5 }),
      issueId: faker.number.int(),
      userId: faker.number.int(),
      createdAt: faker.date.past({ years: 1 }),
      updatedAt: faker.date.recent({ days: 30 }),
    });
  };
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

  describe('Create new comment', () => {
    const newComment: Comment = comment();
    const newCommentDetails: CreateCommentDto = {
      body: faker.lorem.paragraph({ min: 3, max: 5 }),
      issueId: faker.number.int(),
      userId: faker.number.int(),
    };
    it('should throw an error for invalid comment details', async () => {
      const invalidCommentDetails = {
        body: null,
        issueId: null,
        userId: null,
      };
      const invalidProjectErrors = validate(invalidCommentDetails);
      expect(invalidProjectErrors).not.toBe([]);
    });

    it('should send a request to the CRUD service with comment details', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(newComment),
      );

      await controller.create(newCommentDetails);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('createComment');
      expect(mockCrudService.mock.calls[0][1]).toBe(newCommentDetails);
    });

    it('should return the Comment if creation is successful', async () => {
      crudService.send.mockReturnValueOnce(of(newComment));

      const createdComment: Comment = await firstValueFrom(
        await controller.create(newCommentDetails),
      );
      expect(createdComment).toBeInstanceOf(Comment);
      expect(createdComment).toBe(newComment);
    });
  });

  describe('Edit a Comment', () => {
    const commentToBeEdited: Comment = comment();
    const commentId: number = commentToBeEdited.id;
    const editedDetails: UpdateCommentDto = {
      body: faker.lorem.paragraph({ min: 3, max: 5 }),
      issueId: faker.number.int(),
      userId: faker.number.int(),
    };
    const editedComment: Comment = { ...commentToBeEdited, ...editedDetails };

    it('should throw an error for invalid comment details', () => {
      const invalidCommentDetails = {
        ...editedDetails,
        issueId: null,
        userId: null,
      };
      const invalidCommentErrors = validate(invalidCommentDetails);
      expect(invalidCommentErrors).not.toBe([]);
    });

    it('should send a request with the comment ID and details to update', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(editedComment),
      );

      await controller.update(commentId, editedDetails);
      const request: any = mockCrudService.mock.calls[0][1];
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('editComment');
      expect(request.id).toBe(commentId);
      expect(request.updateCommentDto).toBe(editedDetails);
    });

    it('should throw an error if the comment with the given ID is not found', async () => {
      const nonExistentCommentId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(
        controller.update(nonExistentCommentId, editedDetails),
      ).rejects.toThrow(NotFoundException);
    });

    it('should fetch the issue if update is successful', async () => {
      crudService.send.mockReturnValueOnce(of(editedComment));

      const fetchedComment: Comment = await controller.update(
        commentId,
        editedDetails,
      );
      expect(fetchedComment).toBe(editedComment);
    });
  });

  describe('Delete an issue', () => {
    const commentToBeDeleted: Comment = comment();
    const commentId: number = commentToBeDeleted.id;

    it('should send a request with the ID of the comment to be deleted', async () => {
      const mockCrudService = crudService.send.mockReturnValueOnce(
        of(commentToBeDeleted),
      );

      await controller.remove(commentId);
      expect(mockCrudService.mock.calls[0][0].cmd).toBe('deleteComment');
      expect(mockCrudService.mock.calls[0][1]).toBe(commentId);
    });

    it('should throw an error if the comment with the given ID is not found', async () => {
      const nonExistentCommentId: number = faker.number.int();
      crudService.send.mockReturnValueOnce(of(0));

      await expect(controller.remove(nonExistentCommentId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should fetch the comment if deletion is successful', async () => {
      crudService.send.mockReturnValueOnce(of(commentToBeDeleted));

      const fetchedComment: Comment = await controller.remove(commentId);
      expect(fetchedComment).toBe(commentToBeDeleted);
    });
  });
});
