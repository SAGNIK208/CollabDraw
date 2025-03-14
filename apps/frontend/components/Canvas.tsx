"use client";

import { useEffect, useRef,useState } from "react";
import { CanvasRender } from "../draw/CanvasRender";
import Toolbar from "./Toolbar";
import { CanvasElementType, Shapes } from "@repo/common/types";

const Canvas = ({roomId}:{roomId:string}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasInstance = useRef<CanvasRender | null>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [element, setElement] = useState<CanvasElementType>({
        type: Shapes.ARROW,
        x: 50,
        y: 50,
        width: 200,
        height: 200,
        stroke: "#000000",
        fill: null,
        strokeWidth: 2,
        fontSize: null,
        text: null,
        points: [
          { x: 50, y: 50 },
          { x: 250, y: 250 },
        ],
      });

    useEffect(() => {
        if (canvasRef.current) {
          canvasInstance.current = new CanvasRender(canvasRef.current, roomId);
          return () => {
            canvasInstance.current?.destroy();
          };
        }
    }, [roomId]);

    useEffect(() => {
        const updateDimensions = () => {
            setDimensions({ width: window.innerWidth, height: window.innerHeight });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);

        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    useEffect(() => {
        if (canvasInstance.current) {
          canvasInstance.current.applyElementUpdate(element);
        }
      }, [element]);


    return (
        <div className="h-screen overflow-hidden relative">
        {/* Toolbar - Absolute Positioning */}
        <div className="absolute top-0 left-0 w-full z-10">
          <Toolbar onUpdate={setElement} />
        </div>
      
        {/* Canvas - Fullscreen without being affected */}
        <div className="w-full h-full">
          <canvas ref={canvasRef} width={dimensions.width} height={dimensions.height} />
        </div>
      </div>      
      );
}

export default Canvas