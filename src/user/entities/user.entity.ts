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
import { AutoMap } from '@automapper/classes';

import { UserRoleEntity } from './user-role.entity';
import { PostEntity } from '../../post/entities';

@Entity({
  name: 'users',
})
export class UserEntity {
  @AutoMap()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @AutoMap()
  @Column({
    unique: true,
  })
  username: string;

  @AutoMap()
  @Column({
    unique: true,
  })
  email: string;

  @AutoMap()
  @Column()
  hash: string;

  @Column({
    nullable: true,
  })
  hashedRT: string;

  @AutoMap(() => UserRoleEntity)
  @ManyToOne(() => UserRoleEntity, (userRole) => userRole.users, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'roleId' })
  role: UserRoleEntity;

  @AutoMap(() => [PostEntity])
  @OneToMany(() => PostEntity, (post) => post.user)
  posts: PostEntity[];
}
