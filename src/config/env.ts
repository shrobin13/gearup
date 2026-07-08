import { z } from 'zod';
import config from '../config/index.js';

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  DATABASE_URL: z.url(),
  JWT_ACCESS_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  BCRYPT_SALT_ROUNDS: z.coerce.number(),
});

export const env = envSchema.parse(config);
