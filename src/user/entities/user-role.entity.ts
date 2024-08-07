import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { UserEntity } from './user.entity';

@Entity({ name: 'user_role' })
export class UserRoleEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  roleType: string;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
