import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

const mockUser = {
  _id: { toString: () => '1' },
  email: 'a@a.com',
  name: 'A',
  password: 'hash',
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockUser),
            findByEmail: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('token') },
        },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('register returns access_token', async () => {
    const result = await service.register('a@a.com', 'pass', 'A');
    expect(result).toEqual({ access_token: 'token' });
  });

  it('login returns access_token', () => {
    const result = service.login(mockUser as never);
    expect(result).toEqual({ access_token: 'token' });
  });
});
