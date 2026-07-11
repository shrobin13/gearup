
import { Role as PrismaRole, UserStatus as PrismaUserStatus } from "../../../generated/prisma/enums.js";

type Role = (typeof PrismaRole)[keyof typeof PrismaRole];
type UserStatus = (typeof PrismaUserStatus)[keyof typeof PrismaUserStatus];

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: Role;
        status: UserStatus;
      };
    }
  }
}

export { };
