"use client";
import { useState, useEffect } from "react";
import { RoomCard } from "../../components/RoomCard";
import { Layout } from "../../components/Layout";

const RoomsPage = () => {
    const [rooms, setRooms] = useState<string[]>([]);
  
    useEffect(() => {
      const storedRooms = JSON.parse(localStorage.getItem("canvasRooms") || "[]");
      setRooms(storedRooms);
    }, []);
  
    useEffect(() => {
      localStorage.setItem("canvasRooms", JSON.stringify(rooms));
    }, [rooms]);
  
    const addRoom = () => {
      const name = prompt("Enter a name for the room:");
      if (name && !rooms.includes(name)) {
        setRooms([...rooms, name]);
      }
    };

    const deleteRoom = (name: string) => {
      if (confirm(`Are you sure you want to delete '${name}'?`)) {
        setRooms(rooms.filter(room => room !== name));
      }
    };
  
    return (
      <Layout>
        <div className="min-h-[calc(100vh-140px)] flex items-start justify-start bg-gradient-to-br from-blue-100 to-blue-200 p-6 pb-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {rooms.map((name) => (
              <RoomCard key={name} name={name} onClick={() => {}} onDelete={() => deleteRoom(name)} />
            ))}
            <RoomCard onClick={addRoom} />
          </div>
        </div>
      </Layout>
    );
};

export default RoomsPage;
