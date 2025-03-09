import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Resource } from './resource.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Resource, (resource) => resource.role, { eager: true })
  resources: Resource[];
}
