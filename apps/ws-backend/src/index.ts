import { WebSocket, WebSocketServer} from "ws";
import { MessageType } from "./types/type";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "@repo/backend-common/config"; 
import {CreateCanvasElementSchema} from "@repo/common/types";
import type {CanvasElement} from "./types/type"
import {prisma} from "@repo/db/client";
import { IncomingMessage, request } from "http";
import { headers } from "./constants/request";



const PORT  = process.env.PORT || '8081';

class WebSocketServerManager{
    private wss: WebSocketServer
    private rooms: Map<number,Set<WebSocket>>

    constructor(port:number){
        this.wss = new WebSocketServer({port});
        this.rooms = new Map();
        this.wss.on('connection',(ws,request)=>{
            this.handleConnection(ws,request)
        });
    }
    
    private async handleConnection(ws:WebSocket,req:IncomingMessage){
        const token = req.headers[headers.Authorization]?.toString()??"";
        const userId = this.validateUser(token);
        const queryParams = new URLSearchParams(req.url?.split('?')[1]);
        const roomId = queryParams.get('roomId');
        if(!userId || !roomId){
            ws.close();
            return;
        }
        const room = await prisma.room.findFirst({
            where:{
                id:Number(roomId)
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

    private async handleMessage(ws:WebSocket,message:string,roomId:number,userId:string){
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
    
    private async disconnect(ws:WebSocket,roomId:number){
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

    private joinRoom(user:WebSocket,roomId:number){
        let users = this.rooms.get(roomId);
        if(!users){
            users = new Set<WebSocket>();
        }
        users.add(user);
        this.rooms.set(roomId,users);
    }

    private broadCastMessage(roomId:number,data:JSON,ws:WebSocket){
        if(!this.rooms.has(roomId)) return;
        let users : Set<WebSocket>  = this.rooms.get(roomId)!;
        for(const user of users){
            if(user!=ws){
                ws.send(JSON.stringify(data));
            }
        }
    }

    private leaveRoom(user:WebSocket,roomId:number){
        if(!this.rooms.has(roomId)){
            return;
        }
        this.rooms.get(roomId)?.delete(user);
    }

    private async handleElement(ws:WebSocket,data:JSON,roomId:number,userId:string){
        const parsedData = CreateCanvasElementSchema.safeParse(data);
        if(!parsedData.success){
            this.disconnect(ws,roomId);
            return;
        }
        const element : CanvasElement = parsedData.data;
        this.saveElement(element,roomId,userId);
        this.broadCastMessage(roomId,data,ws);
    };

    private async saveElement(element:CanvasElement,roomId:number,userId:string){
        await prisma.canvasElement.create({
            data:{
                ...element,
                roomId:roomId,
                userId:userId
            }
        });
    }
}


new WebSocketServerManager(parseInt(PORT));