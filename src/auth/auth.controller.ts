import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../users/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LogInDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  refreshTokens(@Body() token: { refreshToken: string }) {
    return this.authService.refreshToken(token.refreshToken);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }
}
