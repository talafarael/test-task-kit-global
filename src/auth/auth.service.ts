import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import type { TokenResponse } from './types/token-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(
    email: string,
    password: string,
    name: string,
  ): Promise<TokenResponse> {
    const user = await this.usersService.create(email, password, name);
    return this.generateTokenResponse(user);
  }

  async login(user: UserDocument): Promise<TokenResponse> {
    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(user: UserDocument): TokenResponse {
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
