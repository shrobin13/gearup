
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { providerOrderService } from "./provider.service.js";

const getProviderOrders = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await providerOrderService.getProviderOrders(
        req.user.id
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Orders retrieved successfully",
      data: result,
    });
  }
);

const updateOrderStatus = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await providerOrderService.updateOrderStatus(
        req.params.id,
        req.user.id,
        req.body.status
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Order status updated successfully",
      data: result,
    });
  }
);

export const providerOrderController = {
  getProviderOrders,
  updateOrderStatus,
};
