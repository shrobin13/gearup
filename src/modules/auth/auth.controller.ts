import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";

const setAuthCookies = (res: Response, accessToken: string, refreshToken?: string) => {
  const cookieOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 1000 * 60 * 15,
  });

  if (refreshToken) {
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 60 * 24 * 30,
    });
  }
};

const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.loginUser(req.body);

  setAuthCookies(res, result.accessToken, result.refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.registerUser(req.body);

  setAuthCookies(res, result.access_token, result.refresh_token);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const me = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized",
    });
  }

  const result = await authService.getMe(req.user.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Authorization header is missing or invalid",
    });
  }

  const refreshToken = authHeader.split(" ")[1];
  if (!refreshToken) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Refresh token is missing",
    });
  }

  const result = await authService.refreshToken(refreshToken);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 15,
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Token refreshed successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  registerUser,
  refreshToken,
  me,
}

