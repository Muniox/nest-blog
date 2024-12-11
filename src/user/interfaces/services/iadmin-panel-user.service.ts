import {
  AutomapperReadUserDto,
  ValidationRequestCreateUserDto,
  ValidationRequestUpdateUserDto,
} from '../../dtos';

export const ADMIN_PANEL_SERVICE_TOKEN = 'ADMIN_PANEL_SERVICE_TOKEN';

export interface IAdminPanelUserService {
  createUser(
    item: ValidationRequestCreateUserDto,
  ): Promise<AutomapperReadUserDto>;

  findAllUsersMapped(): Promise<AutomapperReadUserDto[]>;

  logoutUser(id: string): Promise<void>;

  findOneUserMapped(id: string);

  updateUserMapped(id: string, item: ValidationRequestUpdateUserDto);

  removeUser(id: string): Promise<void>;
}
