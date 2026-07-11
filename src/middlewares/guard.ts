import { NextFunction, Request, Response } from "express"
import { CustomError } from "../ExceptionHandler/CustomError.js"
import { StatusCodes } from "http-status-codes"

const guard = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      next(new CustomError(StatusCodes.UNAUTHORIZED, "UNAUTHORIZED"));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new CustomError(StatusCodes.FORBIDDEN, "FORBIDDEN"));
      return;
    }

    next();
  }
}

export default guard;
