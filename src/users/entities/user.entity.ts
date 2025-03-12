import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';

export enum UserStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'The unique identifier for the user' })
  id: number;

  @Column()
  @ApiProperty({ example: 'John', description: 'The first name of the user' })
  firstName: string;

  @Column()
  @ApiProperty({ example: 'Doe', description: 'The last name of the user' })
  lastName: string;

  @Column({ unique: true })
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user',
  })
  email: string;

  @Column()
  @ApiProperty({
    example: 'password123',
    description: 'The password for the user account',
  })
  password: string;

  @Column({ default: UserStatus.PENDING })
  @ApiProperty({
    enum: UserStatus,
    default: UserStatus.PENDING,
    description: 'The status of the user',
  })
  status: UserStatus;

  @ManyToOne(() => Role, (role) => role, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    eager: true,
  })
  @ApiProperty({
    type: () => Role,
    description: 'The role associated with the user',
  })
  role: Role;

  @CreateDateColumn()
  @ApiProperty({ description: 'The creation date of the user record' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ description: 'The last update date of the user record' })
  updatedAt: Date;

  @DeleteDateColumn()
  @ApiProperty({ description: 'The deletion date of the user record' })
  deletedAt: Date;
}
