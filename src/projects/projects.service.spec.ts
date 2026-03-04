import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { Project } from './schemas/project.schema';

const mockProject = {
  _id: '1',
  name: 'P',
  owner: { toString: () => 'u1' },
  members: [],
};

const mockProjectModel = {
  find: jest.fn().mockReturnValue({ sort: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue([]) }) }),
  findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(mockProject) }),
  prototype: { save: jest.fn() },
};

describe('ProjectsService', () => {
  let service: ProjectsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const save = jest.fn().mockResolvedValue(mockProject);
    const model = Object.assign(function () {
      return { save };
    }, mockProjectModel);
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        { provide: getModelToken(Project.name), useValue: model },
      ],
    }).compile();
    service = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findOne throws NotFoundException when not found', async () => {
    (mockProjectModel.findById as jest.Mock).mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });
    await expect(service.findOne('bad', '507f1f77bcf86cd799439011')).rejects.toThrow(NotFoundException);
  });

  it('findAll returns empty array', async () => {
    const result = await service.findAll('507f1f77bcf86cd799439011');
    expect(result).toEqual([]);
  });
});
