import { z } from "zod";

export enum Shapes {
  RECTANGLE = "RECTANGLE",
  ELLIPSE = "ELLIPSE",
  LINE = "LINE",
  ARROW = "ARROW",
  TEXT = "TEXT",
}


export const CreateUserSchema = z.object({
  username: z
    .string()
    .min(3, "username must be 8 characters long")
    .max(20, "username can have maximum 20 characters"),
  email: z.string().email(),
  password: z
    .string()
    .min(6, "Password must have minimum length of 6")
    .max(20, "Password can have a maximum length of 20")
    .regex(/[A-Z]/, "Password must have one character in uppercase")
    .regex(/[a-z]/, "Password must have one character in lowercase")
    .regex(/[0-9]/, "Password must have ond digit"),
});

export const SignInSchema = z.object({
  email: z.string(),
  password: z.string(),
});


export const CreateRoomSchema = z.object({
  name: z
  .string()
  .min(3, "Room Name must be 3 characters long")
  .max(20, "Room Name can have maximum length of 20 characters"),
});

const pointSchema = z.object({ x: z.number(), y: z.number() });

export const CreateCanvasElementSchema = z.object({
  type: z.nativeEnum(Shapes),
  x: z.number().nullable(),
  y: z.number().nullable(),
  width: z.number().nullable(),
  height: z.number().nullable(),
  stroke: z.string(),
  fill: z.string().nullable(),
  strokeWidth: z.number(),
  fontSize: z.number().nullable(),
  text: z.string().nullable(),
  points: z.array(pointSchema),
});

export type AuthFormType = z.infer<typeof CreateUserSchema> | z.infer<typeof SignInSchema>;

export type CreateUserType = z.infer<typeof CreateUserSchema>;

export type CanvasElementType = Partial<z.infer<typeof CreateCanvasElementSchema>>

export type RoomType = {
  "name":string,
  "id":number
};

export {z};