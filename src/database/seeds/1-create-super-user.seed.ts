import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';
import { Resource } from '../../roles/entities/resource.entity';
import { Role } from '../../roles/entities/role.entity';
import { ResourceNames } from '../../roles/models/resource.model';
import { User } from '../../users/entities/user.entity';

export default class CreateSuperUserSeed implements Seeder {
  public async run(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);
    const roleRepository = dataSource.getRepository(Role);
    const resourceRepository = dataSource.getRepository(Resource);
    const role = roleRepository.create({
      name: 'super_admin',
      description: 'Super Admin Role',
      resources: Object.values(ResourceNames).map((name) =>
        resourceRepository.create({
          name,
          description: `Access to ${name} resource`,
          readAccess: true,
          writeAccess: true,
          deleteAccess: true,
        }),
      ),
    });

    await roleRepository.upsert(role, ['name']);
    const user = repository.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'superadmin@example.com',
      password: 'Admin123$$$',
    });
    user.role = role;
    await repository.save(user).catch(() => {
      console.error('This user already exists:');
    });
  }
}
