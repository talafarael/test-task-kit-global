import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockUser = { _id: { toString: () => '507f1f77bcf86cd799439011' } };
const mockProject = { _id: '1', name: 'P' };

describe('ProjectsController', () => {
  let controller: ProjectsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(mockProject),
            create: jest.fn().mockResolvedValue(mockProject),
            update: jest.fn().mockResolvedValue(mockProject),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<ProjectsController>(ProjectsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns array', async () => {
    const result = await controller.findAll(mockUser as never);
    expect(result).toEqual([]);
  });

  it('create returns project', async () => {
    const result = await controller.create(
      { name: 'P', description: 'D' },
      mockUser as never,
    );
    expect(result).toEqual(mockProject);
  });
});
