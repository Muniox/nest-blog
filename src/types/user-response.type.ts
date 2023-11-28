import { UserEntity } from '../user/entities/user.entity';

export type UserResponse = Pick<UserEntity, 'id' | 'email'>;
