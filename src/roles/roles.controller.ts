import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger'; // Import Swagger decorators
import { AuthGuard } from '../auth/guards/auth.guard';
import { SetResourceName } from './decorators/resource.decorator.';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRolesQueryDto } from './dto/find-roles-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity';
import { ResourceNames } from './models/resource.model';
import { RolesService } from './roles.service';

@ApiTags('Roles') // Tag for the group of endpoints in Swagger
@Controller('roles')
@SetResourceName(ResourceNames.ROLE)
@UseGuards(AuthGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    type: Role,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns a list of roles.',
    type: [Role],
  })
  @Get()
  findAll(@Query() query: FindRolesQueryDto) {
    return this.rolesService.findAll(query);
  }

  @ApiResponse({
    status: 200,
    description: 'Returns the role with the given ID.',
    type: Role,
  })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.rolesService.findOne(+id);
  }

  @ApiResponse({
    status: 200,
    description: 'The role has been successfully updated.',
    type: Role,
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @ApiResponse({
    status: 204,
    description: 'The role has been successfully deleted.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.rolesService.remove(+id);
  }
}
