import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { FindRolesQueryDto } from './dto/find-roles-query.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities/role.entity'; // Assuming you have a role entity

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  create(createRoleDto: CreateRoleDto) {
    const newRole = this.roleRepository.create(createRoleDto);
    return this.roleRepository.save(newRole);
  }

  findAll(query: FindRolesQueryDto) {
    const queryBuilder = this.roleRepository.createQueryBuilder('role');
    if (query.search) {
      queryBuilder.where('role.name LIKE :search', {
        search: `%${query.search}%`,
      });
    }
    return queryBuilder.getMany();
  }

  findOne(id: number) {
    return this.roleRepository.findOneBy({ id });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    await this.roleRepository.update(id, updateRoleDto);
    return this.roleRepository.findOneBy({ id });
  }

  remove(id: number) {
    return this.roleRepository.delete(id);
  }
}
