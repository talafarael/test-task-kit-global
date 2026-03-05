import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/user.schema';
import type { TokenResponseDto } from './dto/token-response.dto';

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
  ): Promise<TokenResponseDto> {
    const user = await this.usersService.create(email, password, name);
    return this.generateTokenResponse(user);
  }

  async login(user: UserDocument): Promise<TokenResponseDto> {
    return this.generateTokenResponse(user);
  }

  private generateTokenResponse(user: UserDocument): TokenResponseDto {
    const payload = { sub: user._id.toString(), email: user.email };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
    };
  }
}
