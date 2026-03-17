import { z } from "zod";

export const userDTO = z.object({
  username: z.string(),
  userId: z.string(),
  email: z.email(),
  isVerified: z.boolean(),
  timezone: z.string(),
  locale: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userAuthRecord = z.object({
  userId: z.string(),
  email: z.email(),
  passwordHash: z.string(),
  isVerified: z.boolean(),
});

export const createUserPayload = z.object({
  username: z.string().min(8).max(64),
  email: z.email(),
  passwordHash: z.string(),
  timezone: z.string(),
  locale: z.string(),
});

export const updateUserPayload = createUserPayload.omit({
  username: true,
  passwordHash: true,
  email: true,
});

export type UserDTO = z.infer<typeof userDTO>;
export type UserAuthRecord = z.infer<typeof userAuthRecord>;
export type CreateUserPayload = z.infer<typeof createUserPayload>;
export type UpdateUserPayload = z.infer<typeof updateUserPayload>;
