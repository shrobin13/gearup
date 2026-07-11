import { Role } from "../../../generated/prisma/enums.js";
import type { UserStatus } from "../../../generated/prisma/enums.js";

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IRegisterUser {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: Role;
  phone?: string;
  address?: string;
}

export interface IAuthJwtPayload {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
}
