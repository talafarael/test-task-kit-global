import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './schemas/comment.schema';
import { TasksService } from '../tasks/tasks.service';

const mockComment = {
  _id: '1',
  content: 'text',
  task: { toString: () => '507f1f77bcf86cd799439011' },
  author: { toString: () => '507f1f77bcf86cd799439012' },
};

const mockCommentModel = {
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockComment) }),
  findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  prototype: { save: jest.fn() },
};

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const save = jest.fn().mockResolvedValue(mockComment);
    const model = Object.assign(function () {
      return { save };
    }, mockCommentModel);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: getModelToken(Comment.name), useValue: model },
        {
          provide: TasksService,
          useValue: { findOne: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();
    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne throws NotFoundException when not found', async () => {
    (mockCommentModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findOne('bad', '507f1f77bcf86cd799439011')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('findAll returns empty array', async () => {
    const result = await service.findAll(
      '507f1f77bcf86cd799439011',
      '507f1f77bcf86cd799439012',
    );
    expect(result).toEqual([]);
  });
});
