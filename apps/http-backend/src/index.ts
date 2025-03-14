import express,{Request,Response} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import roomRouter from "./routes/roomRoutes";
const app = express();
const PORT = process.env.port || 8080;

app.use(express.json());
app.use(cors({
    origin:"http://localhost:3002",
    credentials:true
}));
app.use(cookieParser());

app.get("/health", (req:Request,res:Response)=>{
    res.status(200).json({
        "status":"success"
    })
});

app.use("/api/auth",authRouter);

app.use("/api/room",roomRouter);

app.listen((PORT),()=>{
    console.log(`Server is up and running at port ${PORT}`);
});