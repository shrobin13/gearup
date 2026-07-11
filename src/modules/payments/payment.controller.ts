
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse.js";
import { paymentService } from "./payment.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await paymentService.createPayment(
        req.user.id,
        req.body
      );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Payment created successfully",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await paymentService.confirmPayment(
        req.user.id,
        req.body
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment confirmed successfully",
      data: result,
    });
  }
);

const getMyPayments = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await paymentService.getMyPayments(
        req.user.id
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payments retrieved successfully",
      data: result,
    });
  }
);

const getPaymentById = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await paymentService.getPaymentById(
        req.params.id,
        req.user.id
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);

export const paymentController = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
