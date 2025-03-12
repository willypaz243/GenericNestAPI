import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../users/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
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
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch =
      user.status === UserStatus.PENDING
        ? user.password === loginDto.password
        : await bcrypt.compare(loginDto.password, user.password);
    if (isMatch) return user;
    throw new UnauthorizedException('User not found');
  }

  private async generateToken(user: User): Promise<TokenDto> {
    const payload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: '7d',
      secret: process.env.JWT_SECRET,
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
      const newTokens = await this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
      });
      return { accessToken: newTokens, refreshToken };
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async login(loginDto: LogInDto): Promise<TokenDto> {
    const user = await this.validateUser(loginDto);
    return this.generateToken(user);
  }

  async changePassword(user: User, changePasswordDto: ChangePasswordDto) {
    let isMatch: boolean;
    if (user.status === UserStatus.PENDING) {
      isMatch = user.password === changePasswordDto.oldPassword;
      if (isMatch) user.status = UserStatus.ACTIVE;
    } else {
      isMatch = await bcrypt.compare(
        changePasswordDto.oldPassword,
        user.password,
      );
    }

    if (!isMatch) {
      throw new UnauthorizedException('Invalid old password');
    }

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await this.usersRepository.save(user);
    return { message: 'Password changed successfully' };
  }
}
