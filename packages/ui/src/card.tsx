import React from "react";
import { LucideIcon } from "lucide-react";

interface CardProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ title, description, icon: Icon, className }) => {
  return (
    <div className={`p-8 rounded-2xl shadow-xl bg-white border border-gray-200 flex flex-col items-center text-center space-y-4 transform transition-all hover:scale-105 ${className}`}>
      {Icon && <Icon className="w-14 h-14 text-blue-600" />}
      <h3 className="text-2xl font-semibold text-gray-900">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>
    </div>
  );
};