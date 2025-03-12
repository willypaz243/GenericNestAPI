import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({ example: 'your-access-token-example' })
  accessToken: string;

  @ApiProperty({ example: 'your-refresh-token-example' })
  refreshToken: string;
}

export class PayloadDto {
  @ApiProperty({ example: 123456789 })
  sub: number;

  @ApiProperty({ example: 'user@example.com' })
  email: string;
}
