"use client";

import Canvas from "./Canvas";
import { useState,useEffect,useRef } from "react";
import { useRouter } from "next/navigation";
import { BASE_WS_URL } from "@repo/common/constants"; 

const RoomCanvas = ({roomId}:{roomId:string}) => {
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const reconnectRef = useRef(false);
    let reconnectAttempts = 0;
    let reconnectTimer = 0;
    const router = useRouter();

    useEffect(() => {
        const connectWebSocket = () => {
            if (reconnectRef.current) return;
            reconnectRef.current = true;

            const ws = new WebSocket(`wss://${BASE_WS_URL}?roomId=${roomId}`);

            ws.onopen = () => {
                console.log(`Connected to room ${roomId}`);
                reconnectAttempts = 0; 
                reconnectTimer = 0; 
                ws.send(JSON.stringify({ type: "JOIN_ROOM" }));
                reconnectRef.current = false;
            };

            ws.onmessage = (event) => {
                const message = event.data.trim();
                console.log(message);
                if (message === "401 Unauthorized") {
                    console.error("Unauthorized WebSocket access. Redirecting...");
                    router.push("/signin");
                } 
            };

            ws.onerror = (error) => console.log("WebSocket Error:", error);

            ws.onclose = () => {
                reconnectAttempts++;
                reconnectRef.current = false;
                const currentTime = Date.now();
                if (reconnectTimer === 0) {
                    reconnectTimer = currentTime;
                }
                const elapsedTime = currentTime - reconnectTimer;
                if (elapsedTime >= 30000 || reconnectAttempts > 3) {
                    console.warn("Too many reconnect attempts in 30 seconds. Redirecting to sign-in page.");
                    router.push("/rooms");
                } else {
                    if (reconnectAttempts <= 3) {
                        console.warn("Reconnecting in 3s...");
                        setTimeout(connectWebSocket, 1000);
                    }
                }
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