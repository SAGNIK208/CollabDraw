import express,{Request,Response} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes";
import roomRouter from "./routes/roomRoutes";
const app = express();
const PORT = process.env.port || 8080;

app.use(express.json());
const allowedOrigins = [
    'https://collabdraw.sagnik-dev.com',
    'http://localhost:3002'
];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true 
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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