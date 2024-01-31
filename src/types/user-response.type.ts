import { UserEntity } from '../user/entities';

export type UserResponse = Pick<UserEntity, 'id' | 'email' | 'role'>;
