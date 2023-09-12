import { RoleType } from "../enum/RoleType";

export interface Auth {
  token?: string;
  username?: string;
  role?: RoleType
}
