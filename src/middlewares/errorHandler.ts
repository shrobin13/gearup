import type { NextFunction, Request, Response } from "express";
import { CustomError } from "../ExceptionHandler/CustomError.js";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON payload",
    });
  }

  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  const message = error instanceof Error ? error.message : "Internal server error";

  return res.status(500).json({
    success: false,
    message,
  });
};