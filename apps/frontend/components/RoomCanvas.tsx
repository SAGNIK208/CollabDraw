"use client";

import Canvas from "./Canvas";
import { useState,useEffect,useRef } from "react";

const RoomCanvas = ({roomId}:{roomId:string}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const reconnectRef = useRef(false); // Prevent infinite reconnect loop

    useEffect(() => {
        const connectWebSocket = () => {
            if (reconnectRef.current) return; // Prevent multiple connections
            reconnectRef.current = true;

            const ws = new WebSocket(`ws://localhost:8081?roomId=${roomId}`);

            ws.onopen = () => {
                console.log(`Connected to room ${roomId}`);
                ws.send(JSON.stringify({ type: "JOIN_ROOM" }));
                reconnectRef.current = false; // Allow future reconnects
            };

            ws.onmessage = (event) => console.log("Message received:", event.data);

            ws.onerror = (error) => console.error("WebSocket Error:", error);

            ws.onclose = () => {
                console.warn("WebSocket closed. Reconnecting in 3s...");
                reconnectRef.current = false;
                setTimeout(connectWebSocket, 3000);
            };

            setSocket(ws);
        };

        connectWebSocket();

        return () => {
            if (socket) {
                socket.send(JSON.stringify({ type: "LEAVE_ROOM" }));
                socket.close();
            }
        };
    }, []);

    return <Canvas roomId={roomId} socket={socket}></Canvas>
}

export default RoomCanvas;