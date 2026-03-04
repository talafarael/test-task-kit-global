import { Test, TestingModule } from '@nestjs/testing';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const mockUser = { _id: { toString: () => '507f1f77bcf86cd799439011' } };
const mockComment = { _id: '1', content: 'text' };

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue(mockComment),
            create: jest.fn().mockResolvedValue(mockComment),
            update: jest.fn().mockResolvedValue(mockComment),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll returns array', async () => {
    const result = await controller.findAll(
      { task: '507f1f77bcf86cd799439011' },
      mockUser as never,
    );
    expect(result).toEqual([]);
  });

  it('create returns comment', async () => {
    const result = await controller.create(
      { content: 'text', task: '507f1f77bcf86cd799439011' },
      mockUser as never,
    );
    expect(result).toEqual(mockComment);
  });
});
