import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { TagsService } from './tags.service';
import { Tag } from './schemas/tag.schema';
import { ProjectsService } from '../projects/projects.service';

const mockTag = {
  _id: '1',
  name: 'tag',
  project: { toString: () => 'p1' },
};

const mockTagModel = {
  find: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }),
  findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockTag) }),
  prototype: { save: jest.fn() },
};

describe('TagsService', () => {
  let service: TagsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const save = jest.fn().mockResolvedValue(mockTag);
    const model = Object.assign(function () {
      return { save };
    }, mockTagModel);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TagsService,
        { provide: getModelToken(Tag.name), useValue: model },
        {
          provide: ProjectsService,
          useValue: { assertAccess: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne throws NotFoundException when not found', async () => {
    (mockTagModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findOne('bad', '507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
  });

  it('findAll returns empty array', async () => {
    const result = await service.findAll('507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
    expect(result).toEqual([]);
  });
});
