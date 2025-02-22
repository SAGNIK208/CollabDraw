import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string()
        .min(3,"username must be 8 characters long")
        .max(20,"username can have maximum 20 characters"),
    email: z.string()
        .email(),
    password: z.string()
        .min(6,"Password must have minimum length of 6")
        .max(20,"Password can have a maximum length of 20")
        .regex(/[A-Z]/,"Password must have one character in uppercase")
        .regex(/[a-z]/,"Password must have one character in lowercase")
        .regex(/[0-9]/,"Password must have ond digit")
});

export const SignupSchema = z.object({
    email: z.string(),
    password: z.string()
});
