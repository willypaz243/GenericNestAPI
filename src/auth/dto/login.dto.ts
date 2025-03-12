import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, MinLength } from 'class-validator';

export class LogInDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    minLength: 8,
    example: 'password123',
    description: 'The password must be at least 8 characters long',
  })
  @MinLength(8)
  password: string;
}
