
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { prisma } from "../../lib/prisma.js";
import { RentalStatus } from "../../../generated/prisma/enums.js";

const getProviderOrders = async (
  providerId: string
) => {
  return prisma.rentalOrder.findMany({
    where: {
      items: {
        some: {
          gearItem: {
            providerId,
          },
        },
      },
    },
    include: {
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          gearItem: true,
        },
      },
      payments: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const updateOrderStatus = async (
  orderId: string,
  providerId: string,
  status: RentalStatus
) => {
  const order =
    await prisma.rentalOrder.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: {
          include: {
            gearItem: true,
          },
        },
      },
    });

  if (!order) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Rental order not found"
    );
  }

  const providerItems = order?.items.some((item) => item.gearItem.providerId === providerId);

  if (!providerItems) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "FORBIDDEN"
    );
  }

  const allowedTransitions: Record<
    RentalStatus,
    RentalStatus[]
  > = {
    PLACED: ["CONFIRMED"],
    CONFIRMED: ["PAID"],
    PAID: ["PICKED_UP"],
    PICKED_UP: ["RETURNED"],
    RETURNED: [],
    CANCELLED: [],
  };

  if (
    !allowedTransitions[
      order.status as RentalStatus
    ].includes(status)
  ) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      `Invalid status transition from ${order.status} to ${status}`
    );
  }

  return prisma.rentalOrder.update({
    where: {
      id: orderId,
    },
    data: {
      status,
    },
    include: {
      customer: true,
      items: {
        include: {
          gearItem: true,
        },
      },
      payments: true,
    },
  });
};

export const providerOrderService = {
  getProviderOrders,
  updateOrderStatus,
};
