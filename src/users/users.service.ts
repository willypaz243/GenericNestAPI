import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const newUser = this.userRepository.create(createUserDto);
    return this.userRepository.save(newUser);
  }

  async findAll(query: FindUsersQueryDto) {
    const { search, limit = 10, offset = 0 } = query;
    const queryBuilder = this.userRepository.createQueryBuilder('user');
    if (search) {
      queryBuilder.where('user.username LIKE :search', {
        search: `%${search}%`,
      });
    }
    const [users, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount();
    return { users, total };
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    const user = this.userRepository.create(updateUserDto);
    return this.userRepository.save({ ...user, id });
  }

  async remove(id: number) {
    await this.userRepository.softDelete(id);
    return { success: true };
  }
}
