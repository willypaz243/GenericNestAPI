import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../users/decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LogInDto } from './dto/login.dto';
import { TokenDto } from './dto/token.dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiBody({ type: LogInDto })
  @ApiResponse({ status: 200, description: 'Login successful', type: TokenDto })
  login(@Body() loginDto: LogInDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @ApiBody({ schema: { properties: { refreshToken: { type: 'string' } } } })
  @ApiResponse({
    status: 200,
    description: 'Refresh token successful',
    type: TokenDto,
  })
  refreshTokens(@Body() token: { refreshToken: string }) {
    return this.authService.refreshToken(token.refreshToken);
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.authService.changePassword(user, changePasswordDto);
  }
}
