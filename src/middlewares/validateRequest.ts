import { NextFunction, Request, Response } from "express";
import { ZodObject, ZodEffects } from "zod";

const validateRequest =
  (schema: ZodObject | ZodEffects<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
      try {
        schema.parse({
          body: req.body,
          params: req.params,
          query: req.query,
        });

        next();
      } catch (error) {
        next(error);
      }
    };

export default validateRequest;
