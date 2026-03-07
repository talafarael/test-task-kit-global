import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { CommentsService } from '../comments/comments.service';
import { ProjectsService } from '../projects/projects.service';
import { TagsService } from '../tags/tags.service';

const mockTask = {
  _id: '1',
  title: 'T',
  project: { toString: () => 'p1' },
};

const execResolveEmpty = jest.fn().mockResolvedValue([]);
const mockTaskModel = {
  find: jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({ exec: execResolveEmpty }),
    select: jest.fn().mockReturnValue({ exec: execResolveEmpty }),
    exec: execResolveEmpty,
  }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTask) }),
  findByIdAndDelete: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTask) }),
  deleteMany: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue({ deletedCount: 0 }) }),
  prototype: { save: jest.fn() },
};

const mockCommentsService = {
  removeByTaskId: jest.fn().mockResolvedValue(undefined),
  removeByTaskIds: jest.fn().mockResolvedValue(undefined),
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const taskModel = Object.assign(function () {
      return { save: jest.fn().mockResolvedValue(mockTask) };
    }, mockTaskModel);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: taskModel },
        { provide: CommentsService, useValue: mockCommentsService },
        {
          provide: ProjectsService,
          useValue: {
            assertAccess: jest.fn().mockResolvedValue(undefined),
            findAll: jest.fn().mockResolvedValue([{ _id: 'p1' }]),
          },
        },
        {
          provide: TagsService,
          useValue: {
            findOne: jest.fn(),
            validateTagsBelongToProject: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne throws NotFoundException when not found', async () => {
    (mockTaskModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findOne('bad', '507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
  });

  it('findAll returns empty array', async () => {
    const result = await service.findAll('507f1f77bcf86cd799439011', {
      project: '507f1f77bcf86cd799439011',
    });
    expect(result).toEqual([]);
  });
});
