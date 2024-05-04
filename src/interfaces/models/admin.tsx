import { UserRole } from '../interface';

export interface Admin {
  token: string;
  role: UserRole;
}
