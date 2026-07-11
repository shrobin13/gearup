
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse.js";
import { adminService } from "./admin.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const getAllUsers = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllUsers();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  }
);

const updateUserStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await adminService.updateUserStatus(
        req.params.id,
        req.body.status
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "User status updated successfully",
      data: result,
    });
  }
);

const getAllGear = catchAsync(
  async (req: Request, res: Response) => {
    const result = await adminService.getAllGear();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Gear retrieved successfully",
      data: result,
    });
  }
);

const getAllRentals = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await adminService.getAllRentals();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Rentals retrieved successfully",
      data: result,
    });
  }
);

export const adminController = {
  getAllUsers,
  updateUserStatus,
  getAllGear,
  getAllRentals,
};
