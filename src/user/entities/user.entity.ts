import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRoleEntity } from './user-role.entity';

@Entity({
  name: 'users',
})
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    unique: true,
  })
  email: string;

  @ManyToOne(() => UserRoleEntity, (userRole) => userRole.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'roleId' })
  role: UserRoleEntity;

  @Column()
  hash: string;

  @Column({
    nullable: true,
  })
  hashedRT: string;
}
