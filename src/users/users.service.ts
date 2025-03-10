import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersQueryDto } from './dto/find-users-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserStatus } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  private generateTempPassword(): string {
    // Implement a secure method to generate a temporary password
    const length = 12;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    if (!newUser.password) {
      newUser.password = this.generateTempPassword();
    }
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

  async findOne(id: number): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) return null;
    if (user.status === UserStatus.PENDING) return user;

    return { ...user, password: '**********' };
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
