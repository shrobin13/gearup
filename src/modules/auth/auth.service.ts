import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma.js";
import { jwtUtils } from "../../utils/jwt.js";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { ILoginUser, IRegisterUser } from "./auth.interface.js";
import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { StatusCodes } from "http-status-codes";
import { env } from '../../config/env.js';
import { Role } from "../../../generated/prisma/enums.js";
import { User } from "../../../generated/prisma/client.js";

const isValidRole = (role: unknown): role is Role => {
  return role === Role.CUSTOMER || role === Role.PROVIDER || role === Role.ADMIN;
};

const loginUser = async (payload: ILoginUser) => {


  if (!payload || typeof payload !== "object") {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Login payload is required");
  }

  const { email, password } = payload;

  if (!email || !password) {
    throw new CustomError(StatusCodes.BAD_REQUEST, "Email and password are required");
  }

  const user: User = await prisma.user.findUniqueOrThrow({
    where: { email }
  })

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new CustomError(StatusCodes.UNAUTHORIZED, "Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }

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
    refreshToken
  };
}

const refreshToken = async (refreshToken: string) => {
  const verifiedRefreshToken = jwtUtils.verifyToken(refreshToken, env.JWT_REFRESH_SECRET);

  if (!verifiedRefreshToken.success) {
    throw new Error(verifiedRefreshToken.error)
  }

  const { id } = verifiedRefreshToken.data as JwtPayload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id
    }
  })

  const jwtPayload = {
    id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  }


  const accessToken = jwtUtils.createToken(
    jwtPayload,
    env.JWT_ACCESS_SECRET,
    env.JWT_ACCESS_EXPIRES_IN as SignOptions
  );

  return { accessToken }
}


const registerUser = async (payload: IRegisterUser) => {
  const isExist = await prisma.user.findUnique({ where: { email: payload.email } });

  if (isExist) {
    throw new CustomError(StatusCodes.CONFLICT, "Email already exists");
  }

  const hashedPassword = await bcrypt.hash(payload.password, env.BCRYPT_SALT_ROUNDS);
  const role = isValidRole(payload.role) ? payload.role : undefined;

  const user = await prisma.user.create({
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

  const jwtExpiresIn = env.JWT_ACCESS_EXPIRES_IN;

  return {
    user,
    access_token: jwtUtils.createToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      env.JWT_ACCESS_SECRET,
      jwtExpiresIn as SignOptions,
    ),
    refresh_token: jwtUtils.createToken(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      env.JWT_REFRESH_SECRET,
      env.JWT_REFRESH_EXPIRES_IN as SignOptions,
    ),
  };
};

const getMe = async (userId: string) => {
  return await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      address: true,
      role: true,
      status: true,
    }
  })
}

export const authService = {
  loginUser,
  refreshToken,
  registerUser,
  getMe
}
