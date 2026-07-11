import { StatusCodes } from "http-status-codes";
import Stripe from "stripe";

import { CustomError } from "../ExceptionHandler/CustomError.js";
import { env } from "../config/env.js";

let stripeClient: Stripe | null = null;

export const getStripeClient = () => {
  if (!env.STRIPE_SECRET_KEY) {
    throw new CustomError(
      StatusCodes.SERVICE_UNAVAILABLE,
      "Stripe is not configured"
    );
  }

  if (!stripeClient) {
    stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  }

  return stripeClient;
};
