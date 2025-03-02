"use client";

import React from "react";
import { cn } from "@repo/lib/utils";
import { LucideIcon } from "lucide-react";

type ButtonProps = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
  icon?: LucideIcon;
};


export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = "primary",
  className,
  icon: Icon,
}) => {
  const baseStyles = "px-5 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-md";
  const variantStyles = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-800 text-white hover:bg-gray-900",
    outline: "border border-gray-600 text-gray-800 hover:bg-gray-100",
  };

  return (
    <button
      onClick={onClick}
      className={cn(baseStyles, variantStyles[variant], className)}
    >
      {Icon && <Icon className="w-5 h-5" />} {label}
    </button>
  );
};
