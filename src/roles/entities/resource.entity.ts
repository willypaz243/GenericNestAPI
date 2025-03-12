import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity()
export class Resource {
  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @PrimaryColumn()
  name: string;

  @Column()
  description: string;

  @Column({ default: false })
  readAccess: boolean;

  @Column({ default: false })
  writeAccess: boolean;

  @Column({ default: false })
  deleteAccess: boolean;

  @ManyToOne(() => Role, (role) => role.resources, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  role: Role;
}
