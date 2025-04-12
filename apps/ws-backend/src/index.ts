import { WebSocket, WebSocketServer} from "ws";
import { MessageType } from "./types/type";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"; 
import {CreateCanvasElementSchema,CanvasElement} from "@repo/common/types";
import {prisma} from "@repo/db/client";
import { IncomingMessage,Server,createServer } from "http";
import {publishMessage} from "@repo/mq/taskPublisher";
import * as cookie from "cookie";



const PORT  = process.env.PORT || '8081';

class WebSocketServerManager{
    private wss: WebSocketServer
    private rooms: Map<string,Set<WebSocket>>

    constructor(server: Server){
        this.wss = new WebSocketServer({noServer:true});
        this.rooms = new Map();
        server.on("upgrade", (req, socket, head) => this.handleUpgrade(req, socket, head));
        this.wss.on('connection',(ws: WebSocket & { userId?: string },request)=>{
            if(!ws.userId) return ws.close();
            this.handleConnection(ws,request,ws.userId)
        });
    }

    private handleUpgrade(req: IncomingMessage, socket: any, head: any) {
        const cookies = cookie.parse(req.headers.cookie || "");
        const token = cookies.token || "";
        const userId = this.validateUser(token);
        if (!userId) {
            socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
            socket.destroy();
            return;
        }
        this.wss.handleUpgrade(req, socket, head, (ws) => {
            (ws as any).userId = userId;
            this.wss.emit("connection", ws, req,userId);
        });
    }
    
    private async handleConnection(ws:WebSocket,req:IncomingMessage,userId:string){
        const queryParams = new URLSearchParams(req.url?.split('?')[1]);
        const roomId = queryParams.get('roomId');
        if(!roomId){
            ws.close();
            return;
        }
        const room = await prisma.room.findFirst({
            where:{
                id:roomId
            }
        });
        if(!room){
            ws.close();
            return;
        }
        ws.on('message',(message)=>{
            this.handleMessage(ws,message.toString(),room.id,userId);
        });
    }

    private async handleMessage(ws:WebSocket,message:string,roomId:string,userId:string){
        const data = JSON.parse(message);
        switch(data.type){
            case MessageType.JOIN_ROOM:{
                this.joinRoom(ws,roomId);
                break;
            }
            case MessageType.LEAVE_ROOM:{
                this.leaveRoom(ws,roomId);
                break;
            }
            case MessageType.ELEMENT: {
                this.handleElement(ws,data.element,roomId,userId);
                break;
            }
            case MessageType.PING: {
                ws.send("pong");
                break;
            }
            default:{
                this.disconnect(ws,roomId)
                break;
            }
        }
    }
    
    private async disconnect(ws:WebSocket,roomId:string){
        this.leaveRoom(ws,roomId);
        ws.close();
    }

    private validateUser(token:string): string | null{
       try {
        const decoded = jwt.verify(token,JWT_SECRET);
        if(typeof decoded === "string") return null;
        if(decoded){
            return decoded.userId;
        }
       } catch (error) {
         console.log("Unable to authorize the user",error)
       }
        return null;
    }

    private joinRoom(user:WebSocket,roomId:string){
        let users = this.rooms.get(roomId);
        if(!users){
            users = new Set<WebSocket>();
        }
        users.add(user);
        this.rooms.set(roomId,users);
    }

    private broadCastMessage(roomId:string,data:JSON,ws:WebSocket){
        if(!this.rooms.has(roomId)) return;
        let users : Set<WebSocket>  = this.rooms.get(roomId)!;
        for(const user of users){
            if(user!==ws){
                user.send(JSON.stringify(data));
            }
        }
    }

    private leaveRoom(user:WebSocket,roomId:string){
        if(!this.rooms.has(roomId)){
            return;
        }
        this.rooms.get(roomId)?.delete(user);
    }

    private async handleElement(ws:WebSocket,data:JSON,roomId:string,userId:string){
        const parsedData = CreateCanvasElementSchema.safeParse(data);
        if(!parsedData.success){
            console.log(parsedData.error.flatten().fieldErrors)
            this.disconnect(ws,roomId);
            return;
        }
        const element : CanvasElement = parsedData.data;
        publishMessage(JSON.stringify({element,roomId,userId}));
        this.broadCastMessage(roomId,data,ws);
    };

}


const server = createServer();
new WebSocketServerManager(server);
server.listen(parseInt(PORT), () => console.log(`Server running on port ${PORT}`));