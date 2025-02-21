import express,{Request,Response} from "express";

const app = express();
const PORT = process.env.port || 8080;

app.get("/health", (req:Request,res:Response)=>{
    res.status(200).json({
        "status":"success"
    })
});

app.listen((PORT),()=>{
    console.log(`Server is up and running at port ${PORT}`);
});