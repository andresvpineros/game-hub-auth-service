import { z } from "zod";

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(6),
});

export const signupSchema = z.object({
  email: z.string().email(),
  username: z
    .string()
    .min(3)
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),
  password: z.string().min(6),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});
