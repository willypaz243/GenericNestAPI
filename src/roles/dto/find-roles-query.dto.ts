import { IsOptional, IsString } from 'class-validator';

export class FindRolesQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
