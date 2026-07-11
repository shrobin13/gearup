import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { jwtUtils } from "../../utils/jwt.js";
import type { JwtPayload, SignOptions } from "jsonwebtoken";
import type { IAuthJwtPayload, ILoginUser, IRegisterUser } from "./auth.interface.js";
import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { StatusCodes } from "http-status-codes";
import { env } from "../../config/env.js";
import { Role } from "../../../generated/prisma/enums.js";
import type { User } from "../../../generated/prisma/client.js";

const isValidRole = (role: unknown): role is Role => {
  return role === Role.CUSTOMER || role === Role.PROVIDER || role === Role.ADMIN;
};

const createJwtPayload = (user: Pick<User, "id" | "name" | "email" | "role" | "status">): IAuthJwtPayload => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  status: user.status,
});

const getDatabaseError = (error: unknown, fallbackMessage: string) => {
  const code = typeof error === "object" && error !== null && "code" in error ? (error as { code?: string }).code : undefined;

  if (code === "P2002") {
    return new CustomError(StatusCodes.CONFLICT, "Email already exists");
  }

  return new CustomError(StatusCodes.INTERNAL_SERVER_ERROR, fallbackMessage);
};

const loginUser = async (payload: ILoginUser) => {
  if (!payload || typeof payload !== "object") {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Login payload is required");
  }

  const { email, password } = payload;

  if (!email || !password) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Email and password are required");
  }

  let user: User | null;

  try {
    user = await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    throw getDatabaseError(error, "Database error while logging in");
  }

  if (!user) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
  }

  const jwtPayload = createJwtPayload(user);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    env.JWT_REFRESH_SECRET,
    env.JWT_REFRESH_EXPIRES_IN as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (incomingRefreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(incomingRefreshToken, env.JWT_REFRESH_SECRET);

  if (!verifiedRefreshToken.success) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  let user: User | null;

  try {
    user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
  } catch (error) {
    throw getDatabaseError(error, "Database error while refreshing token");
  }

  if (!user) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  const jwtPayload = createJwtPayload(user);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions,
  );

  return { accessToken };
};

const registerUser = async (payload: IRegisterUser) => {
  let isExist: User | null;

  try {
    isExist = await prisma.user.findUnique({ where: { email: payload.email } });
  } catch (error) {
    throw getDatabaseError(error, "Database error while checking email availability");
  }

  if (isExist) {
    throw new CustomError(StatusCodes.CONFLICT, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, env.BCRYPT_SALT_ROUNDS);
  const role = isValidRole(payload.role) ? payload.role : undefined;

  let user: Pick<User, "id" | "name" | "email" | "role" | "status" | "createdAt"> | null;

  try {
    user = await prisma.user.create({
      data: {
        name: payload.name,
        email: payload.email,
        password: hashedPassword,
        phone: payload.phone,
        address: payload.address,
        ...(role ? { role } : {}),
      },
      select: { id: true, name: true, email: true, role: true, status: true, createdAt: true },
    });
  } catch (error) {
    throw getDatabaseError(error, "Database error while creating user");
  }

  const jwtExpiresIn = env.JWT_ACCESS_EXPIRES_IN;

  return {
    user,
    accessToken: jwtUtils.createToken(
      createJwtPayload(user),
      env.JWT_ACCESS_SECRET,
      jwtExpiresIn as SignOptions,
    ),
    refreshToken: jwtUtils.createToken(
      createJwtPayload(user),
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN as SignOptions,
    ),
  };
};

const getMe = async (userId: string) => {
  let user;

  try {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        role: true,
        status: true,
      },
    });
  } catch (error) {
    throw getDatabaseError(error, "Database error while fetching user profile");
  }

  if (!user) {
    throw new CustomError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
};

export const authService = {
  loginUser,
  refreshToken,
  registerUser,
  getMe,
};
