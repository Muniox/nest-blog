import { UserEntity } from '../entities';
import {
  ValidationRequestCreateUserDto,
  ValidationRequestUpdateUserDto,
} from '../dto';

export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

export interface IUserRepository {
  findOneUserByEmailOrUsername(
    item: ValidationRequestCreateUserDto | ValidationRequestUpdateUserDto,
  ): Promise<UserEntity | null>;

  findOneUserByEmailOrUsernameWhereNotIdWithRole(
    item: ValidationRequestUpdateUserDto,
    id: string,
  ): Promise<UserEntity | null>;

  findAllUsersWithRole(): Promise<UserEntity[]>;

  findOneUserByEmailWithRole(email: string): Promise<UserEntity | null>;

  findOneUserWithRole(id: string): Promise<UserEntity | null>;

  deleteHashedRefreshToken(id: string): Promise<void>;

  createOrUpdateUser(item: UserEntity): Promise<UserEntity>;

  deleteUser(item: UserEntity): Promise<void>;

  updateUserHashRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<void>;
}
