import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { UserRoleEntity } from './user-role.entity';
import { PostEntity } from '../../post/entities';

// TODO: add username to user (needed for displaying who published post!)
@Entity({
  name: 'users',
})
export class UserEntity {
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

  @Column()
  hash: string;

  @Column({
    nullable: true,
  })
  hashedRT: string;

  @ManyToOne(() => UserRoleEntity, (userRole) => userRole.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'roleId' })
  role: UserRoleEntity;

  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
}
