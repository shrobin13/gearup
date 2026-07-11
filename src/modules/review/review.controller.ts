
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import sendResponse from "../../utils/sendResponse.js";
import { reviewService } from "./review.service.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createReview = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new Error("Unauthorized");
    }

    const result =
      await reviewService.createReview(
        req.user.id,
        req.body
      );

    sendResponse(res, {
      statusCode: StatusCodes.CREATED,
      success: true,
      message: "Review submitted successfully",
      data: result,
    });
  }
);

const getReviewsByGearId = catchAsync(
  async (req: Request, res: Response) => {
    const result =
      await reviewService.getReviewsByGearId(
        req.params.gearId as string
      );

    sendResponse(res, {
      statusCode: StatusCodes.OK,
      success: true,
      message: "Reviews retrieved successfully",
      data: result,
    });
  }
);

export const reviewController = {
  createReview,
  getReviewsByGearId,
};
