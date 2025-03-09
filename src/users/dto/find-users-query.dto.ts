import { IsInt, IsOptional, IsString } from 'class-validator';

export class FindUsersQueryDto {
  @IsOptional()
  @IsString()
  search?: string;
  @IsOptional()
  @IsInt()
  limit?: number;
  @IsOptional()
  @IsInt()
  offset?: number;
}
