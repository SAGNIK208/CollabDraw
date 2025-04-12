import { Router, Response } from "express";
import { validateUser } from "../middlewares";
import { AuthenticatedRequest } from "../types/type";
import { prisma } from "@repo/db/client";
import { CreateRoomSchema } from "@repo/common/types";
import { CustomError } from "../exceptions/CustomError";

const roomRouter:Router = Router();

roomRouter.post(
  "/",
  validateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    const result = CreateRoomSchema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({
        error: result.error.flatten().fieldErrors,
        status: "error",
      });
      return;
    }
    try {
      const userId = req.userId;
      if (!userId) {
        throw new CustomError("Something Went Wrong", 500);
      }
      const exists = await prisma.room.findFirst({
        where: {
          name: result.data.name,
        },
      });
      if (exists) {
        throw new CustomError("Room already exists", 400);
      }
      const room = await prisma.room.create({
        data: {
          name: result.data.name,
          adminId: userId,
        },
      });

      res.status(200).json({
        message: "Room created",
        data: {
          roomId: room.id,
          adminId: room.adminId,
          roomName: room.name
        },
        status: "success",
      });
    } catch (error) {
      if (error instanceof CustomError) {
        res.status(error.statusCode).json({
          message: error.message,
          status: "error",
        });
        return;
      } else {
        res.status(500).json({
          message: "Something went wrong",
          status: "error",
        });
      }
    }
  }
);

roomRouter.get(
  "/",
  validateUser,
  async (req: AuthenticatedRequest, res: Response) => {
  const rooms = await prisma.room.findMany({
      where:{
        adminId:req.userId
      },
      select: {
        name: true,
        id: true
      }
    });
    res.status(200).json({
      data: {
        rooms
      },
    });
  }
);

roomRouter.get(
  "/:roomName",
  validateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    const roomName = String(req.params.roomName);
    const exists = await prisma.room.findFirst({
      where: {
        name: roomName,
      },
    });
    if (!exists) {
      res.status(404).json({
        message: "No such room exists",
        success: "error",
      });
      return;
    }
    res.status(200).json({
      data: {
        roomId: exists.id,
        adminId: exists.adminId,
      },
    });
  }
);

roomRouter.delete(
  "/:roomName",
  validateUser,
  async (req: AuthenticatedRequest, res: Response) => {
  const roomName = String(req.params.roomName);
  const rooms = await prisma.room.delete({
      where:{
        name:roomName,
        adminId:req.userId
      }
    });
    res.status(200).json({
      data: {
        rooms
      },
    });
  }
);

roomRouter.get(
  "/:roomId/canvas",
  validateUser,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const roomId = req.params.roomId ?? "";
      let limit = Number(req.query.limit);
      if (!limit || isNaN(limit)) limit = 1000;
      const elements = await prisma.canvasElement.findMany({
        where: {
          roomId: roomId,
        },
        orderBy: {
          id: "desc",
        },
        take: limit,
      });
      res.status(200).json({
        "data": elements,
        "status":"success"
      });
    } catch (error) {
      console.log(error);
      res.status(200).json({
        "data": [],
        "status":"success"
      });
    }
  }
);


export default roomRouter;