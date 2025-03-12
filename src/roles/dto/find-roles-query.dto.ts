import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FindRolesQueryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'A string to search for roles',
    example: 'admin',
  })
  search?: string;
}
