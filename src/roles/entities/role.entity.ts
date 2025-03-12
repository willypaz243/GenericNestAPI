import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier for the role' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ example: 'admin', description: 'The name of the role' })
  name: string;

  @Column()
  @ApiProperty({ description: 'A brief description of the role' })
  description: string;

  @OneToMany(() => Resource, (resource) => resource.role, {
    cascade: true,
    eager: true,
  })
  @ApiProperty({
    type: [Resource],
    description: 'The resources associated with this role',
  })
  resources: Resource[];
}
