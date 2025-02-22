import express,{Request,Response} from "express";
import authRouter from "./routes/authRoutes";
const app = express();
const PORT = process.env.port || 8080;

app.use(express.json());

app.get("/health", (req:Request,res:Response)=>{
    res.status(200).json({
        "status":"success"
    })
});

app.use("/api/auth",authRouter);

app.listen((PORT),()=>{
    console.log(`Server is up and running at port ${PORT}`);
});