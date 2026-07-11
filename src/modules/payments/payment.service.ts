
import { StatusCodes } from "http-status-codes";

import { CustomError } from "../../ExceptionHandler/CustomError.js";
import { getStripeClient } from "../../lib/stripe.js";
import { prisma } from "../../lib/prisma.js";
import { PaymentProvider, PaymentStatus, RentalStatus } from "../../../generated/prisma/enums.js";
import { env } from "../../config/env.js";

const finalizePayment = async (
  paymentId: string,
  transactionId: string
) => {
  return prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({
      where: { id: paymentId },
      include: { rentalOrder: true },
    });

    if (!payment) {
      throw new CustomError(
        StatusCodes.NOT_FOUND,
        "Payment not found"
      );
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return payment;
    }

    const updatedPayment = await tx.payment.update({
      where: { id: payment.id },
      data: {
        transactionId,
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await tx.rentalOrder.update({
      where: { id: payment.rentalOrderId },
      data: {
        status: RentalStatus.PAID,
      },
    });

    return updatedPayment;
  });
};

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

  if (payload.provider !== "STRIPE") {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Only Stripe payments are currently supported"
    );
  }

  const existingPayment =
    await prisma.payment.findFirst({
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

  const customer = await prisma.user.findUnique({
    where: { id: customerId },
    select: { email: true },
  });

  const payment = await prisma.payment.create({
    data: {
      rentalOrderId: rental.id,
      customerId,
      transactionId: "pending",
      amount: rental.totalAmount,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
  });

  try {
    const stripe = getStripeClient();
    const amountInCents = Math.round(Number(rental.totalAmount) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: customer?.email ?? undefined,
      success_url: `${env.STRIPE_SUCCESS_URL}?payment_id=${payment.id}`,
      cancel_url: `${env.STRIPE_CANCEL_URL}?payment_id=${payment.id}`,
      client_reference_id: payment.id,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            product_data: {
              name: `GearUp rental order ${payment.id}`,
            },
            unit_amount: amountInCents,
          },
        },
      ],
      metadata: {
        paymentId: payment.id,
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { transactionId: session.id },
    });

    return {
      paymentId: payment.id,
      sessionId: session.id,
      checkoutUrl: session.url,
      amount: Number(rental.totalAmount),
      provider: "STRIPE",
    };
  } catch (error) {
    await prisma.payment.delete({ where: { id: payment.id } });
    throw error;
  }
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

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.retrieve(payload.transactionId);

  if (session.payment_status !== "paid" || session.status !== "complete") {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Payment is not completed yet"
    );
  }

  return finalizePayment(
    payment.id,
    payload.transactionId
  );
};

const handleStripeWebhook = async (
  signature: string,
  payload: Buffer
) => {
  const stripe = getStripeClient();
  const endpointSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!endpointSecret) {
    throw new CustomError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "Stripe webhook is not configured"
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      endpointSecret
    );
  } catch (error) {
    throw new CustomError(
      StatusCodes.BAD_REQUEST,
      "Invalid Stripe webhook signature"
    );
  }

  if (
    event.type === "checkout.session.completed"
  ) {
    const session = event.data.object as {
      id?: string;
      metadata?: Record<string, string>;
      client_reference_id?: string;
    };

    const paymentId =
      session.metadata?.paymentId ??
      session.client_reference_id;

    if (!paymentId) {
      throw new CustomError(
        StatusCodes.BAD_REQUEST,
        "Missing payment reference in Stripe session"
      );
    }

    await finalizePayment(
      paymentId,
      session.id ?? paymentId
    );

    return {
      received: true,
      paymentId,
    };
  }

  if (
    event.type === "checkout.session.expired" ||
    event.type === "checkout.session.async_payment_failed"
  ) {
    const session = event.data.object as {
      metadata?: Record<string, string>;
      client_reference_id?: string;
    };

    const paymentId =
      session.metadata?.paymentId ??
      session.client_reference_id;

    if (paymentId) {
      await prisma.payment.update({
        where: { id: paymentId },
        data: {
          status: PaymentStatus.FAILED,
        },
      });
    }
  }

  return {
    received: true,
    eventType: event.type,
  };
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
          items: {
            include: {
              gearItem: true,
            },
          },
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
            items: {
              include: {
                gearItem: true,
              },
            },
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
  handleStripeWebhook,
  confirmPayment,
  getMyPayments,
  getPaymentById,
};
