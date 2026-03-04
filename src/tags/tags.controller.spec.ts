import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockUser = { _id: { toString: () => '507f1f77bcf86cd799439011' } };
const mockTag = { _id: '1', name: 'tag' };

describe('TagsController', () => {
  let controller: TagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(mockTag),
            create: jest.fn().mockResolvedValue(mockTag),
            update: jest.fn().mockResolvedValue(mockTag),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns array', async () => {
    const result = await controller.findAll(
      { project: '507f1f77bcf86cd799439011' },
      mockUser as never,
    );
    expect(result).toEqual([]);
  });

  it('create returns tag', async () => {
    const result = await controller.create(
      { name: 'tag', project: '507f1f77bcf86cd799439011' },
      mockUser as never,
    );
    expect(result).toEqual(mockTag);
  });
});
