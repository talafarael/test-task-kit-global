import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const mockUser = {
  _id: { toString: () => '1' },
  email: 'a@a.com',
  name: 'A',
};

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue({ access_token: 'token' }),
            login: jest.fn().mockResolvedValue({ access_token: 'token' }),
          },
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();
    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('register returns access_token', async () => {
    const result = await controller.register({
      email: 'a@a.com',
      password: 'pass123',
      name: 'A',
    });
    expect(result).toEqual({ access_token: 'token' });
  });

  it('me returns user', async () => {
    const result = await controller.me(mockUser as never);
    expect(result).toEqual({ id: '1', email: 'a@a.com', name: 'A' });
  });
});
