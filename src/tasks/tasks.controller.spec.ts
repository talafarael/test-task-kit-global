import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockUser = { _id: { toString: () => '507f1f77bcf86cd799439011' } };
const mockTask = { _id: '1', title: 'T' };

describe('TasksController', () => {
  let controller: TasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(mockTask),
            findSubtasks: jest.fn().mockResolvedValue([]),
            create: jest.fn().mockResolvedValue(mockTask),
            update: jest.fn().mockResolvedValue(mockTask),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns array', async () => {
    const result = await controller.findAll(
      '507f1f77bcf86cd799439011',
      {},
      mockUser as never,
    );
    expect(result).toEqual([]);
  });

  it('create returns task', async () => {
    const result = await controller.create(
      { title: 'T', project: '507f1f77bcf86cd799439011' },
      mockUser as never,
    );
    expect(result).toEqual(mockTask);
  });
});
