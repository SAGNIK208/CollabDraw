"use client";

import { useEffect, useState } from "react";

interface TooltipProps {
  message: string|null;
  statusCode?: number | undefined;
  type: "success" | "error" | null; // Determines the style
}

export default function ApiTooltip({ message, statusCode, type }: TooltipProps) {
  const [visible, setVisible] = useState(true);
  console.log(message,statusCode,"in apiToolTip",visible);
  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => setVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div
    className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 text-sm text-white rounded-lg shadow-lg transition-opacity duration-300 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`}
  >
    <span>{message} {statusCode && `(${statusCode})`}</span>
  </div>
  );
}
