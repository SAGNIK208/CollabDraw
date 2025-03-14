"use client";

import { useState, useEffect } from "react";
import { ToggleGroup, ToggleGroupItem } from "@radix-ui/react-toggle-group";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { CanvasElementType, Shapes } from "@repo/common/types";
import { Circle, Square, Pencil, Minus } from "lucide-react";

const STROKE_WIDTHS = [1, 2, 3, 4, 5] as const;
const FONT_SIZES = [12, 16, 20, 24, 32] as const;

interface ToolbarProps {
  onUpdate: (element: CanvasElementType) => void;
}

export default function Toolbar({ onUpdate }: ToolbarProps) {
  const [element, setElement] = useState<CanvasElementType>({
    type: Shapes.ARROW,
    x: 50,
    y: 50,
    width: 200,
    height: 200,
    stroke: "#000000",
    fill: "",
    strokeWidth: 2,
    fontSize: null,
    text: null,
    points: [
      { x: 50, y: 50 },
      { x: 250, y: 250 },
    ],
  });

  useEffect(() => {
    onUpdate(element);
  }, [element, onUpdate]);

  const updateElement = <K extends keyof CanvasElementType>(
    key: K,
    value: CanvasElementType[K]
  ) => {
    setElement((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="flex items-center gap-4 px-4 py-2 bg-gradient-to-br from-blue-100 to-blue-200 shadow-md">
      {/* Shape Selection */}
      <ToggleGroup
        type="single"
        value={element.type}
        onValueChange={(val: Shapes) => val && updateElement("type", val)}
        className="flex gap-2"
      >
        <ToggleGroupItem
          value={Shapes.ARROW}
          className={`flex items-center justify-center p-2 rounded-md transition ${
            element.type === Shapes.ARROW
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          <Pencil className="w-5 h-5" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value={Shapes.LINE}
          className={`flex items-center justify-center p-2 rounded-md transition ${
            element.type === Shapes.LINE
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          <Minus className="w-5 h-5" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value={Shapes.RECTANGLE}
          className={`flex items-center justify-center p-2 rounded-md transition ${
            element.type === Shapes.RECTANGLE
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          <Square className="w-5 h-5" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value={Shapes.ELLIPSE}
          className={`flex items-center justify-center p-2 rounded-md transition ${
            element.type === Shapes.ELLIPSE
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          <Circle className="w-5 h-5" />
        </ToggleGroupItem>

        <ToggleGroupItem
          value={Shapes.TEXT}
          className={`flex items-center justify-center p-2 rounded-md transition text-lg font-bold ${
            element.type === Shapes.TEXT
              ? "bg-blue-500 text-white"
              : "bg-white hover:bg-gray-300"
          }`}
        >
          A
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Stroke Width Dropdown (Fixed) */}
      <div className="relative">
        <Select
          value={(element.strokeWidth??1).toString()} // Explicitly set value
          onValueChange={(val) => {
            updateElement("strokeWidth", Number(val));
            (document.activeElement as HTMLElement | null)?.blur();
          }}
        >
          <SelectTrigger className="relative w-20 px-3 py-2 bg-white border border-gray-300 rounded-md">
            <SelectValue>{element.strokeWidth}px</SelectValue>
          </SelectTrigger>
          <SelectContent className="z-50 bg-white border border-gray-300 shadow-lg rounded-md">
            {STROKE_WIDTHS.map((size) => (
              <SelectItem
                key={size}
                value={size.toString()}
                className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-md"
              >
                {size}px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Font Size Dropdown (Only for Text) */}
      {element.type === Shapes.TEXT && (
        <div className="relative">
          <Select
            value={element.fontSize?.toString() || ""}
            onValueChange={(val) => {
              updateElement("fontSize", Number(val));
              (document.activeElement as HTMLElement | null)?.blur();
            }}
          >
            <SelectTrigger className="relative w-24 px-3 py-2 bg-white border border-gray-300 rounded-md">
              <SelectValue>{element.fontSize ? `${element.fontSize}px` : "Font Size"}</SelectValue>
            </SelectTrigger>
            <SelectContent className="z-50 bg-white border border-gray-300 shadow-lg rounded-md">
              {FONT_SIZES.map((size) => (
                <SelectItem
                  key={size}
                  value={size.toString()}
                  className="px-3 py-2 hover:bg-blue-500 hover:text-white cursor-pointer rounded-md"
                >
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Stroke Color Picker */}
      <div className="flex items-center gap-2">
        <span className="text-sm">Stroke:</span>
        <input
          type="color"
          value={element.stroke}
          onChange={(e) => updateElement("stroke", e.target.value)}
          className="w-8 h-8 p-1 rounded-md border-none outline-none"
        />
      </div>

      {/* Fill Color (Only for Shapes) */}
      {element.type !== Shapes.TEXT && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Fill:</span>
          <input
            type="color"
            value={element.fill || "#ffffff"}
            onChange={(e) => updateElement("fill", e.target.value)}
            className="w-8 h-8 p-1 rounded-md border-none outline-none cursor-pointer disabled:opacity-50"
          />
        </div>
      )}
    </div>
  );
}
