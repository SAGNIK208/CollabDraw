import axios from "axios";
import {BASE_API_URL} from "@repo/common/constants";
import { RoomType,CanvasElementType } from "@repo/common/types";
axios.defaults.withCredentials = true;

export async function fetchRooms(cookies:string) : Promise<RoomType[]>{
    let rooms:RoomType[] = [];
    try{
        const response = await axios.get(`${BASE_API_URL}/room`,{
            headers:{
                Cookie:cookies
            }
        });
        rooms = response.data.data.rooms;
    }catch(error){
        console.log(error);
    }
    return rooms;
}
export async function fetchRoomElements(roomId: string) {
    let rooms:CanvasElementType[] = [];
    try{
        const response = await axios.get(`${BASE_API_URL}/room/${roomId}/canvas`);
        rooms = response.data.data;
    }catch(error){
        console.log(error);
    }
    return rooms;
}

export async function createRoom(name:string) : Promise<RoomType|null>{
    const room:RoomType  = {} as RoomType;
    try{
        const response = await axios.post(`${BASE_API_URL}/room`,{
            name:name
        });
        room.id = response.data.data.roomId;
        room.name = response.data.data.roomName;
    }catch(error){
        console.log(error);
    }
    return room;
}

export async function deleteRoom(name:string) : Promise<void>{
    try{
        await axios.delete(`${BASE_API_URL}/room/${name}`);
    }catch(error){
        console.log(error);
    }
}