import { Response, NextFunction } from "express";
import { JWT_SECRET } from "@repo/backend-common/config";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/type";

export function validateUser(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token?.toString() ?? "";
  try {
    const decodedUser = jwt.verify(token, JWT_SECRET);
    if (!decodedUser || typeof decodedUser === "string") {
      res.status(403).json({
        message: "Unauthorized",
        status: "error",
      });
      return;
    }
    req.userId = decodedUser.userId;
    next();
  } catch (error) {
    res.status(403).json({
      message: "Unauthorized",
      status: "error",
    });
  }
}
