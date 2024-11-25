import { Role } from './user-roles';

export type PostResponse = {
  id: string;
  title: string;
  description: string;
  img: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  username: string;
  role: Role;
};
