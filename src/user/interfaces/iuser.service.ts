import { AutomapperReadUserDto, ValidationRequestUpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';

export const USER_SERVICE_TOKEN = 'USER_SERVICE_TOKEN';

export interface IUserService {
  removeUser(id: string): Promise<void>;

  updateUserMapped(
    id: string,
    item: ValidationRequestUpdateUserDto,
  ): Promise<AutomapperReadUserDto>;

  findOneUserMapped(id: string): Promise<AutomapperReadUserDto>;

  findOneUser(id: string): Promise<UserEntity>;

  findUserByEmail(email: string): Promise<UserEntity>;

  updateUserHashRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<void>;
}
