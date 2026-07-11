import type { Response } from "express";

type SendResponsePayload<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: Array<Record<string, unknown>>;
};

const sendResponse = <T>(res: Response, payload: SendResponsePayload<T>) => {
  const { statusCode, success, message, data, errors } = payload;

  return res.status(statusCode).json({
    statusCode,
    success,
    message,
    data,
    ...(errors ? { errors } : {}),
  });
};

export default sendResponse;
