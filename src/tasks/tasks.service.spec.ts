import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './schemas/task.schema';
import { ProjectsService } from '../projects/projects.service';
import { TagsService } from '../tags/tags.service';

const mockTask = {
  _id: '1',
  title: 'T',
  project: { toString: () => 'p1' },
};

const mockTaskModel = {
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTask) }),
  prototype: { save: jest.fn() },
};

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const save = jest.fn().mockResolvedValue(mockTask);
    const model = Object.assign(function () {
      return { save };
    }, mockTaskModel);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getModelToken(Task.name), useValue: model },
        {
          provide: ProjectsService,
          useValue: {
            hasAccess: jest.fn().mockResolvedValue(true),
            findAll: jest.fn().mockResolvedValue([{ _id: 'p1' }]),
          },
        },
        {
          provide: TagsService,
          useValue: { findOne: jest.fn() },
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
    const result = await service.findAll('507f1f77bcf86cd799439011', {});
    expect(result).toEqual([]);
  });
});
