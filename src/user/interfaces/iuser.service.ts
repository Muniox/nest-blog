import { AutomapperReadUserDto, ValidationRequestUpdateUserDto } from '../dtos';
import { UserEntity } from '../entities';

export const USER_SERVICE_TOKEN = 'USER_SERVICE_TOKEN';

export interface IUserService {
  /**
   * Function remove user with provided ID
   * @param id user ID (uuid)
   */
  removeUser(id: string): Promise<void>;

  /**
   * Function update user where userId is equal to provided uuid
   * @param id user ID
   * @param item user data that should be update
   * @returns updated user data
   */
  updateUserMapped(
    id: string,
    item: ValidationRequestUpdateUserDto,
  ): Promise<AutomapperReadUserDto>;

  /**
   * Function return filtered User data (no critical data included) where userID is equal to provided uuid
   * @param id user ID (uuid)
   * @returns user data
   */
  findOneUserMapped(id: string): Promise<AutomapperReadUserDto>;

  /**
   * Function return all User data (critical data included) where userID is equal to provided uuid
   * @param id user ID (uuid)
   * @return user data
   */
  findOneUser(id: string): Promise<UserEntity>;

  /**
   * Function return all User data (critical data included) where userEmail is equal to provided email
   * @param email user email
   */
  findUserByEmail(email: string): Promise<UserEntity>;

  /**
   * Function update refresh token hash in database for user where userId is equal to provided uuid
   * @param id user ID (uuid)
   * @param hashedRefreshToken new hashed refresh token
   */
  updateUserHashRefreshToken(
    id: string,
    hashedRefreshToken: string,
  ): Promise<void>;
}
