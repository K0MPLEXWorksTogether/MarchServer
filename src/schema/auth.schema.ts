import { z } from "zod";

export const signupRequestSchema = z.object({
  username: z.string().min(8).max(64),
  email: z.email(),
  passwordHash: z.string().min(1),
  timezone: z.string(),
  locale: z.string(),
});

export const loginRequestSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

export const verifyQuerySchema = z.object({
  userId: z.string().min(1),
  token: z.uuid(),
});

export type SignupRequest = z.infer<typeof signupRequestSchema>;
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type VerifyQuery = z.infer<typeof verifyQuerySchema>;
