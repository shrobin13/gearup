
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse.js";
import { rentalService } from "./rental.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createRental = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentalService.createRental(
      req.user?.id as string,
      req.body
    );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Rental order created successfully",
      data: result,
    });
  }
);

const getMyRentals = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentalService.getMyRentals(
      req.user?.id as string
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Rental orders retrieved successfully",
      data: result,
    });
  }
);

const getRentalById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentalService.getRentalById(
      req.params.id as string,
      req.user?.id as string
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Rental order retrieved successfully",
      data: result,
    });
  }
);

const cancelRental = catchAsync(
  async (req: Request, res: Response) => {
    const result = await rentalService.cancelRental(
      req.params.id as string,
      req.user?.id as string
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Rental order cancelled successfully",
      data: result,
    });
  }
);

export const rentalController = {
  createRental,
  getMyRentals,
  getRentalById,
  cancelRental,
};
