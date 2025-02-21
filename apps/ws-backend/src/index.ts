import { WebSocketServer } from "ws";

const PORT  = process.env.PORT || '8081';
const ws = new WebSocketServer({port:parseInt(PORT)});

ws.on("connection",(ws)=>{
    console.log("connection established");
    ws.on("message",(message)=>{
        ws.send("pong");
    })
});