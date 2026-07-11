
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { prisma } from "../../lib/prisma.js";
import { PaymentStatus, RentalStatus } from "../../../generated/prisma/enums.js";

const createPayment = async (
  customerId: string,
  payload: {
    rentalOrderId: string;
    provider: "STRIPE" | "SSLCOMMERZ";
  }
) => {
  const rental = await prisma.rentalOrder.findFirst({
    where: {
      id: payload.rentalOrderId,
      customerId,
    },
  });

  if (!rental) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Rental order not found"
    );
  }

  const existingPayment =
    await prisma.payment.findUnique({
      where: {
        rentalOrderId: rental.id,
      },
    });

  if (existingPayment) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Payment already exists for this rental"
    );
  }

  return prisma.payment.create({
    data: {
      rentalOrderId: rental.id,
      amount: rental.totalAmount,
      provider: payload.provider,
      status: PaymentStatus.PENDING,
    },
  });
};

const confirmPayment = async (
  customerId: string,
  payload: {
    paymentId: string;
    transactionId: string;
  }
) => {
  const payment =
    await prisma.payment.findUnique({
      where: {
        id: payload.paymentId,
      },
      include: {
        rentalOrder: true,
      },
    });

  if (!payment) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Payment not found"
    );
  }

  if (
    payment.rentalOrder.customerId !==
    customerId
  ) {
    throw new CustomError(
      StatusCodes.FORBIDDEN,
      "FORBIDDEN"
    );
  }

  if (
    payment.status ===
    PaymentStatus.COMPLETED
  ) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Payment already completed"
    );
  }

  return prisma.$transaction(async (tx) => {
    const updatedPayment =
      await tx.payment.update({
        where: {
          id: payment.id,
        },
        data: {
          transactionId:
            payload.transactionId,
          status:
            PaymentStatus.COMPLETED,
          paidAt: new Date(),
        },
      });

    await tx.rentalOrder.update({
      where: {
        id: payment.rentalOrderId,
      },
      data: {
        status: RentalStatus.PAID,
      },
    });

    return updatedPayment;
  });
};

const getMyPayments = async (
  customerId: string
) => {
  return prisma.payment.findMany({
    where: {
      rentalOrder: {
        customerId,
      },
    },
    include: {
      rentalOrder: {
        include: {
          gearItem: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getPaymentById = async (
  paymentId: string,
  customerId: string
) => {
  const payment =
    await prisma.payment.findFirst({
      where: {
        id: paymentId,
        rentalOrder: {
          customerId,
        },
      },
      include: {
        rentalOrder: {
          include: {
            gearItem: true,
          },
        },
      },
    });

  if (!payment) {
    throw new CustomError(
      StatusCodes.NOT_FOUND,
      "Payment not found"
    );
  }

  return payment;
};

export const paymentService = {
  createPayment,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
