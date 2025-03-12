import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'oldPass123' })
  oldPassword: string;

  @IsNotEmpty()
  @MinLength(8)
  @ApiProperty({ example: 'newPass456' })
  newPassword: string;
}
