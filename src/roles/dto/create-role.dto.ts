import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

import {
  IsBoolean,
  IsEnum,
  IsOptional,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ResourceNames } from '../models/resource.model';

export class CreateResourceDto {
  @IsOptional()
  @ApiProperty({ example: 1 })
  id?: number;

  @IsEnum(ResourceNames)
  @ApiProperty({ enum: ResourceNames, example: ResourceNames.ROLE })
  name: ResourceNames;

  @MinLength(3)
  @ApiProperty({ example: 'Description of the resource' })
  description: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  readAccess?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  writeAccess?: boolean = false;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: false })
  deleteAccess?: boolean = false;
}

export class CreateRoleDto {
  @MinLength(3)
  @ApiProperty({ example: 'Role Name' })
  name: string;

  @MinLength(3)
  @ApiProperty({ example: 'Description of the role' })
  description: string;

  @ValidateNested({ each: true })
  @Type(() => CreateResourceDto)
  @ApiProperty({ type: [CreateResourceDto] })
  resources: CreateResourceDto[];
}
