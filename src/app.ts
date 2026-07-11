import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { paymentController } from './modules/payments/payment.controller.js';
import router from './routes/route.js';

const app: Application = express();

app.post(
  '/api/payments/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/payment/success", (req: Request, res: Response) => {
  const paymentId = typeof req.query.payment_id === "string" ? req.query.payment_id : "";

  res.status(200).json({
    statusCode: 200,
    success: true,
    message: "Payment completed successfully",
    data: {
      paymentId,
      status: "success",
    },
  });
});

app.get("/payment/cancel", (req: Request, res: Response) => {
  const paymentId = typeof req.query.payment_id === "string" ? req.query.payment_id : "";

  res.status(200).json({
    statusCode: 200,
    success: false,
    message: "Payment cancelled",
    data: {
      paymentId,
      status: "cancelled",
    },
  });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to gearup!");
});

app.use("/api", router);
app.use(errorHandler);

export default app;
