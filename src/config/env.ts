import dotenv from "dotenv";
import path from "node:path";
import { z } from "zod";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),

  DATABASE_URL: z.url(),

  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),

  JWT_ACCESS_EXPIRES_IN: z.string().min(1),
  JWT_REFRESH_EXPIRES_IN: z.string().min(1),

  BCRYPT_SALT_ROUNDS: z.coerce.number().int().positive(),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
