
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { prisma } from "../../lib/prisma.js";

const createReview = async (
  customerId: string,
  payload: {
    gearItemId: string;
    rating: number;
    comment: string;
  }
) => {
  const gear = await prisma.gearItem.findUnique({
    where: {
      id: payload.gearItemId,
    },
  });

  if (!gear) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Gear not found"
    );
  }

  const completedRental =
    await prisma.rentalOrder.findFirst({
      where: {
        customerId,
        gearItemId: payload.gearItemId,
        status: "RETURNED",
      },
    });

  if (!completedRental) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "You can review only returned rentals"
    );
  }

  const existingReview =
    await prisma.review.findFirst({
      where: {
        customerId,
        gearItemId: payload.gearItemId,
      },
    });

  if (existingReview) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Review already submitted"
    );
  }

  return prisma.review.create({
    data: {
      customerId,
      gearItemId: payload.gearItemId,
      rating: payload.rating,
      comment: payload.comment,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};

const getReviewsByGearId = async (
  gearItemId: string
) => {
  return prisma.review.findMany({
    where: {
      gearItemId,
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const reviewService = {
  createReview,
  getReviewsByGearId,
};
