import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LogInDto } from './dto/login.dto';
import { PayloadDto, TokenDto } from './dto/token.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private async validateUser(loginDto: LogInDto): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { email: loginDto.email },
    });
    if (user && user.password === loginDto.password) {
      return user;
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  private async generateToken(user: User): Promise<TokenDto> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
    });
    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string): Promise<TokenDto> {
    try {
      const payload =
        await this.jwtService.verifyAsync<PayloadDto>(refreshToken);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('Invalid token');
      }
      const newTokens = await this.jwtService.signAsync(payload);
      return { accessToken: newTokens, refreshToken };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login(loginDto: LogInDto): Promise<TokenDto> {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }
}
