import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']),
  BASE_URL: z.string().url(),

  DATABASE_URL: z.string().url(),

  JWT_SECRET_KEY: z.string().min(10),

  MAIL_HOST: z.string(),
  MAIL_PORT: z.string().transform(Number),
  MAIL_USER: z.string().email(),
  MAIL_PASSWORD: z.string(),

  MAX_FILE_SIZE: z.string().transform(Number),
  MAX_FILES_IN_UPLOAD: z.string().transform(Number),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
});

export type EnvSchema = z.infer<typeof envSchema>;
