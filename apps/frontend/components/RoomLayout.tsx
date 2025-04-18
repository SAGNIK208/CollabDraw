"use client";

import React, { useState } from "react"; // Import useState
import axios from "axios";
import { useRouter } from "next/navigation";
import { RoomType } from "@repo/common/types"; // Common types
import { createRoom, deleteRoom } from "../lib/rooms"; // API functions
import { Layout } from "./Layout"; // Main Layout wrapper
import { RoomCard } from "./RoomCard"; // Room Card component
import { Button } from "@repo/ui/button"; // Button component
import { CreateRoomModal } from "./CreateRoomModal"; // Import the modal component

const RoomLayout = ({ initialRooms }: { initialRooms: RoomType[] }) => {
  const [rooms, setRooms] = useState<RoomType[]>(initialRooms);
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // State for modal visibility
  const router = useRouter();

  // --- Modal Control Handlers ---
  const openCreateRoomModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
  };

  // --- CRUD and Navigation Handlers ---

  // Passed to the modal to handle creation logic
  const handleCreateRoom = async (name: string) => {
    try {
      const room = await createRoom(name.trim()); // Assume createRoom handles API call
      if (room) {
        // Use functional update for state based on previous state
        setRooms((prevRooms) => [...prevRooms, room]);
        handleCloseModal(); // Close modal on success
      } else {
        // Handle cases where room might not be returned even without error
        throw new Error("Room data was not returned after creation.");
      }
    } catch (error) {
      console.error("Failed to create room:", error);
      // Re-throw the error to be caught and displayed by the modal's error handling
      if (error instanceof Error) {
        throw new Error(
          error.message || "An unknown error occurred during room creation."
        );
      }
    }
  };

  const removeRoom = async (room: RoomType) => {
    if (confirm(`Are you sure you want to delete room '${room.name}'?`)) {
      try {
        await deleteRoom(room.name); // Or use room.id if API requires it
        setRooms((prevRooms) => prevRooms.filter((r) => r.id !== room.id)); // Filter by ID is safer
      } catch (error) {
        console.error("Failed to delete room:", error);
        alert("Failed to delete room. Please try again.");
      }
    }
  };

  const navigateToRoom = (room: RoomType) => {
    router.push(`/rooms/${room.id}`); // Navigate to specific room view
  };

  const handleJoinRoom = () => {
    const trimmedRoomId = roomIdInput.trim();
    if (trimmedRoomId) {
      router.push(`/rooms/${trimmedRoomId}`); // Navigate to canvas view for joining
    } else {
      alert("Please enter a Room ID.");
    }
  };

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        await axios({
          url: `http://localhost:8080/api/auth/logout`, // Ensure URL is correct
          method: "POST",
          withCredentials: true,
        });
        router.push("/signin"); // Redirect to signin page
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Logout failed. Please try again.");
      }
    }
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-140px)] flex flex-col md:flex-row bg-gradient-to-br from-blue-100 to-blue-200 p-8 md:p-10 gap-8">
        {/* Left: Room List */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Rooms</h1>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Map existing rooms */}
            {rooms.map((room) => (
              <RoomCard
                key={room.id} // Use unique ID for key
                id={room.id}
                name={room.name}
                onClick={() => navigateToRoom(room)}
                onDelete={() => removeRoom(room)}
              />
            ))}
            {/* Add Room Card - Triggers Modal */}
            <RoomCard
              isAddCard={true}
              onClick={openCreateRoomModal} // Updated onClick
            />
          </div>
        </div>

        {/* Right: Logout Button + Join Room Panel */}
        <div className="w-full md:w-80 flex flex-col gap-5 items-stretch mt-6 md:mt-0">
          {/* Logout Button */}
          <Button
            label="Logout"
            variant="logout"
            onClick={handleLogout}
            className="w-auto self-center md:self-end"
          />
          {/* Join Room Panel */}
          <div className="bg-white rounded-xl shadow-lg p-6 flex-grow flex flex-col">
            <h2 className="text-2xl font-semibold mb-5 text-gray-800">
              Join Room
            </h2>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:ring-offset-1"
              placeholder="Enter Room ID"
              value={roomIdInput}
              onChange={(e) => setRoomIdInput(e.target.value)}
            />
            <Button
              label="Join"
              variant="primary"
              onClick={handleJoinRoom}
              className="w-full py-2.5" // Removed mt-auto previously
            />
          </div>
        </div>
      </div>

      {/* Render the Create Room Modal (conditionally based on isOpen) */}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateRoom}
      />
    </Layout>
  );
};

export default RoomLayout;
