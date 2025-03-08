"use client";
import { useState, useEffect } from "react";
import { RoomCard } from "../../components/RoomCard";
import { Layout } from "../../components/Layout";
import Link from "next/link";

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

    // const handleLogout = () => {
    //   if (confirm("Are you sure you want to logout?")) {
    //     localStorage.clear(); // Clears all stored data
    //     router.push("/login"); // Redirect to login page (update path if needed)
    //   }
    // };
  
    return (
      <Layout>
        <div className="min-h-[calc(100vh-140px)] flex flex-col bg-gradient-to-br from-blue-100 to-blue-200 p-6 pb-16">
          
          {/* Logout Button - Positioned at Top-Right */}
                  {/* Logout Link Styled as a Tab */}
                  <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-semibold text-gray-800">Your Rooms</h1>
            <Link 
              href="/signin"
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </Link>
          </div>
          {/* Room Grid */}
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
