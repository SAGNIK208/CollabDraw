"use client";
import { RoomCard } from "./RoomCard";
import { Layout } from "./Layout";
import {createRoom,deleteRoom} from "../lib/rooms";
import { RoomType } from "@repo/common/types";
import { Button } from "@repo/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const RoomLayout = ({initialRooms}:{initialRooms:RoomType[]}) => {

    const[rooms,setRooms] = useState<RoomType[]>(initialRooms);
    const router = useRouter();
  
    const addRoom = async () => {
      const name = prompt("Enter a name for the room:") || "";
      const room = await createRoom(name);
      if(room){
        setRooms([...rooms,room]);
      }
    };

    const removeRoom = async (room: RoomType) => {
      if (confirm(`Are you sure you want to delete '${name}'?`)) {
        await deleteRoom(room.name);
        setRooms((prevRooms) => prevRooms.filter((r) => r.name !== room.name));
      }
    };

    const navigateToRoom = (room: RoomType) => {
      router.push(`/rooms/${room.id}`);
    };

    const handleLogout = async () => {
      if (confirm("Are you sure you want to logout?")) {
        await axios({
            url:`http://localhost:8080/api/auth/logout`,
            method: "POST",
            withCredentials:true
          });
        router.push("/signin");
      }
    };
  
    return (
      <Layout>
        <div className="min-h-[calc(100vh-140px)] flex flex-col bg-gradient-to-br from-blue-100 to-blue-200 p-6 pb-16">
          
          {/* Logout Button - Positioned at Top-Right */}
                  {/* Logout Link Styled as a Tab */}
                  <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Your Rooms</h1>
            <Button label="Logout" variant="logout" onClick={handleLogout}/>
          </div>
          {/* Room Grid */}
          <div className="grid lg:grid-cols-4 sm:grid-cols-2 md:grid-cols-3 gap-1">
            {rooms.map((room) => (
              <RoomCard key={room.name} name={room.name} onClick={()=>navigateToRoom(room)} onDelete={() => removeRoom(room)} />
            ))}
            <RoomCard onClick={addRoom} />
          </div>
        </div>
      </Layout>
    );
};

export default RoomLayout;
