import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { gearService } from "./gear.service.js";
import sendResponse from "../../utils/sendResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createGear = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user?.id;

    const result = await gearService.createGear(
      providerId as string,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Gear created successfully",
      data: result,
    });
  }
);

const getAllGear = catchAsync(
  async (req: Request, res: Response) => {
    const result = await gearService.getAllGear();

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Gear retrieved successfully",
      data: result,
    });
  }
);

const getGearById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await gearService.getGearById(
      req.params.id as string
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Gear retrieved successfully",
      data: result,
    });
  }
);

const updateGear = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user?.id;

    const result = await gearService.updateGear(
      req.params.id as string,
      providerId as string,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Gear updated successfully",
      data: result,
    });
  }
);

const deleteGear = catchAsync(
  async (req: Request, res: Response) => {
    const providerId = req.user?.id;

    await gearService.deleteGear(
      req.params.id as string,
      providerId as string
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Gear deleted successfully",
      data: null,
    });
  }
);

export const gearController = {
  createGear,
  getAllGear,
  getGearById,
  updateGear,
  deleteGear,
};
