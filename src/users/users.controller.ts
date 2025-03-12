import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { SetResourceName } from '../roles/decorators/resource.decorator.';
import { ResourceNames } from '../roles/models/resource.model';
import { CurrentUser } from './decorators/user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@SetResourceName(ResourceNames.USER)
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Find all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns a list of users',
    type: [User],
  })
  findAll(@Query() query: FindUsersQueryDto): Promise<User[]> {
    return this.usersService.findAll(query);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user',
    type: User,
  })
  @SetResourceName(ResourceNames.EMPTY)
  getCurrentUser(@CurrentUser() user: User) {
    return user;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Find a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the user with the specified ID',
    type: User,
  })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
    type: User,
  })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({
    status: 204,
    description: 'The user has been successfully deleted.',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
