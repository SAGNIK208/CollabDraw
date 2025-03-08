import { Router, Request, Response } from "express";
import { CreateUserSchema,SignInSchema } from "@repo/common/types"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "@repo/db/client"
import { CustomError } from "../exceptions/CustomError";
import { JWT_SECRET } from "@repo/backend-common/config";
import { AuthenticatedRequest } from "../types/type";
import { validateUser } from "../middlewares";

const authRouter: Router = Router();
const saltRounds = process.env.SALT_ROUNDS || 5;

authRouter.post("/signup", async (req: Request, res: Response) => {
    const result = CreateUserSchema.safeParse(req.body);
    if(!result.success){
         res.status(400).json({
            "message": result.error.flatten().fieldErrors,
            "status": "error"
        });
        return;
    }
    try{
        const username = result.data.username;
        const password = result.data.password;
        const hashedPassword = await bcrypt.hash(password,saltRounds);
        const email = result.data.email;
        const exists = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        if(exists){
            throw new CustomError("User Already Exists",400);
        }
        const user = await prisma.user.create({
            data:{
                username : username,
                password : hashedPassword,
                email : email
            }
        });
        res.status(200).json({
            "status": "success",
            "userId": user.id,
            "message": "User Created Successfully"
        });
    }catch(error){
        if(error instanceof CustomError){
            res.status(error.statusCode).json({
                "message": error.message,
                "status": "error"
            });
            return;
        }
        res.status(500).json({
            "message": "Something went wrong",
            "status":"error"
        });
    }
});

authRouter.post("/signin", async (req: Request, res: Response) => {

    const result = SignInSchema.safeParse(req.body);
    if(!result.success){
        res.status(400).json({
            "message": result.error.flatten().fieldErrors,
            "status": "error"
        });
        return;   
    }
    try{
        const user = await prisma.user.findFirst({
            where: {
                email: result.data.email
            }
        });
        if(!user){
            throw new CustomError("User Does not exists",404);
        }
        const verify = await bcrypt.compare(result.data.password,user.password);
        if(!verify){
            throw new CustomError("Invalid Credentials",401);
        }
        const token = jwt.sign({
            userId : user.id
        },JWT_SECRET)
        res.status(200).json({
            "token": token,
            "status": "success",
            "message":"Welcome back! You've successfully signed in. Redirecting now..."
        })
    }catch(error){
        if(error instanceof CustomError){
            res.status(error.statusCode).json({
                "message": error.message,
                "status": "error"
            });
            return;
        }
        res.status(500).json({
            "message": "Something went wrong",
            "status":"error"
        });
    }

});

authRouter.get("/rooms",validateUser,async (req:AuthenticatedRequest,res:Response)=>{
    res.status(200).json({
        "message": "User is Authorized",
        "data": req.userId,
        "status":"success"
    });
});


export default authRouter;