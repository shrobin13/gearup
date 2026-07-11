
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { prisma } from "../../lib/prisma.js";
import { RentalStatus } from "../../../generated/prisma/enums.js";

const createRental = async (
  customerId: string,
  payload: {
    gearItemId: string;
    quantity: number;
    startDate: Date;
    endDate: Date;
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

  if (gear.stockQuantity < payload.quantity) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Insufficient stock available"
    );
  }

  const startDate = new Date(payload.startDate);
  const endDate = new Date(payload.endDate);

  if (endDate <= startDate) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "End date must be after start date"
    );
  }

  const rentalDays = Math.ceil(
    (endDate.getTime() - startDate.getTime()) /
    (1000 * 60 * 60 * 24)
  );

  const totalAmount =
    rentalDays *
    Number(gear.pricePerDay) *
    payload.quantity;

  return prisma.$transaction(async (tx) => {
    const rental = await tx.rentalOrder.create({
      data: {
        customerId,
        startDate,
        endDate,
        totalAmount,
        status: RentalStatus.PLACED,
      },
      include: {
        items: {
          include: {
            gearItem: true,
          },
        },
      },
    });

    await tx.gearItem.update({
      where: {
        id: payload.gearItemId,
      },
      data: {
        stockQuantity: {
          decrement: payload.quantity,
        },
      },
    });

    return rental;
  });
};

const getMyRentals = async (
  customerId: string
) => {
  return prisma.rentalOrder.findMany({
    where: {
      customerId,
    },
    include: {
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

const getRentalById = async (
  rentalId: string,
  customerId: string
) => {
  const rental =
    await prisma.rentalOrder.findFirst({
      where: {
        id: rentalId,
        customerId,
      },
      include: {
        items: {
          include: {
            gearItem: true,
          },
        },
        payments: true,
      },
    });

  if (!rental) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Rental not found"
    );
  }

  return rental;
};

const cancelRental = async (
  rentalId: string,
  customerId: string
) => {
  const rental =
    await prisma.rentalOrder.findFirst({
      where: {
        id: rentalId,
        customerId,
      },
      include: {
        items: true,
      },
    });

  if (!rental) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Rental not found"
    );
  }

  if (rental.status !== RentalStatus.PLACED) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Only placed rentals can be cancelled"
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedRental =
      await tx.rentalOrder.update({
        where: {
          id: rentalId,
        },
        data: {
          status: RentalStatus.CANCELLED,
        },
      });

    await tx.gearItem.update({
      where: {
        id: rental.items[0]?.gearItemId ?? "",
      },
      data: {
        stockQuantity: {
          increment: rental.items[0]?.quantity ?? 1,
        },
      },
    });

    return updatedRental;
  });
};

export const rentalService = {
  createRental,
  getMyRentals,
  getRentalById,
  cancelRental,
};
