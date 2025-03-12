import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ResourceNames } from '../models/resource.model';
import { Role } from './role.entity';

@Entity()
export class Resource {
  @PrimaryColumn({ name: 'role_id' })
  @ApiProperty({ example: 1 })
  roleId: number;

  @PrimaryColumn()
  @ApiProperty({ enum: ResourceNames, example: ResourceNames.ROLE })
  name: ResourceNames;

  @Column()
  @ApiProperty({ example: 'This is an example description.' })
  description: string;

  @Column({ default: false })
  @ApiProperty({ default: false, example: false })
  readAccess: boolean;

  @Column({ default: false })
  @ApiProperty({ default: false, example: false })
  writeAccess: boolean;

  @Column({ default: false })
  @ApiProperty({ default: false, example: false })
  deleteAccess: boolean;

  @ManyToOne(() => Role, (role) => role.resources, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @ApiProperty({ type: () => Role })
  role: Role;
}
