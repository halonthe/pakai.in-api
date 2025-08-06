import { z } from "zod";

const passwordSchema = z
  .string()
  .trim()
  .min(6)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(/[!@#$%^&*]/, "Password must contain at least one symbol");

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Name to short")
    .max(100, "Max 100 characters"),
  email: z.email("Please enter a valid email").lowercase(),
  password: passwordSchema,
  confirmPassword: z
    .string()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password and Confirm Password doesn't match",
      path: ["confirmPassword"],
    })
    .transform(({ name, email, password }) => ({ name, email, password })),
});
