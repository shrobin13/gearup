import { Request, Response, NextFunction } from "express";
import { catchAsync } from "../../utils/catchAsync.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { StatusCodes } from "http-status-codes";
const loginUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.loginUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});


const registerUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

export const authController = {
  loginUser,
  registerUser,
}

