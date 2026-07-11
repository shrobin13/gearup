
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse.js";
import { paymentService } from "./payment.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createPayment = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

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

const handleStripeWebhook = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (typeof signature !== "string" || !signature) {
      throw new Error("Stripe signature is missing");
    }

    const result = await paymentService.handleStripeWebhook(
      signature,
      req.body as Buffer
    );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Stripe webhook processed successfully",
      data: result,
    });
  }
);

const confirmPayment = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

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
    if (!req.user) {
      throw new Error("Unauthorized");
    }

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
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const result =
      await paymentService.getPaymentById(
        req.params.id as string,
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
  handleStripeWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
