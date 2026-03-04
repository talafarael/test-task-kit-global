import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ConflictException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

const mockUserModel = Object.assign(
  function () {
    return { save: jest.fn().mockResolvedValue({ _id: '1', email: 'a@a.com', name: 'A' }) };
  },
  {
    findOne: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
    findById: jest.fn().mockReturnValue({ exec: jest.fn().mockResolvedValue(null) }),
  },
);

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getModelToken(User.name), useValue: mockUserModel },
      ],
    }).compile();
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByEmail returns null when not found', async () => {
    const result = await service.findByEmail('a@a.com');
    expect(result).toBeNull();
  });

  it('create throws ConflictException when email exists', async () => {
    mockUserModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue({ _id: '1', email: 'a@a.com' }),
    });
    await expect(service.create('a@a.com', 'pass', 'A')).rejects.toThrow(
      ConflictException,
    );
  });
});
