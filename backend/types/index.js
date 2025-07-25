import {z} from "zod";


export const signupSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50),
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(100),
});


export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" }),

  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});