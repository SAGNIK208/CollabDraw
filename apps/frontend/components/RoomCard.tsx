"use client";

import React, { useState } from 'react'; // Import useState for visual feedback
import { PlusCircle, Trash2, ClipboardCopy, Check } from "lucide-react"; // Import Check icon

export const RoomCard = ({
  id,
  name,
  onClick,
  onDelete,
  isAddCard
}: {
  id?: string;
  name?: string;
  onClick: () => void;
  onDelete?: () => void;
  isAddCard?: boolean;
}) => {
  const isAddAction = isAddCard || !name;
  const [copied, setCopied] = useState(false); // State for visual feedback

  // Handler for copying the room link
  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!id) return;

    const roomPath = `${id}`; // Construct the full path

    try {
      await navigator.clipboard.writeText(roomPath);
      console.log(`Copied to clipboard: ${roomPath}`); // Log success silently
      setCopied(true); // Trigger visual feedback
      setTimeout(() => setCopied(false), 1500); // Reset feedback after 1.5s
      // Success alert removed
    } catch (err) {
      console.error('Failed to copy path:', err);
      alert(`Could not copy path: ${roomPath}`); // Keep error alert
    }
  };


  return (
    <div
      className={`
        group w-full aspect-video
        border shadow-md flex items-center justify-center
        cursor-pointer rounded-xl relative
        transition-all duration-200 ease-in-out
        ${
          isAddAction
            ? 'bg-blue-50 border-2 border-dashed border-blue-400 hover:border-blue-500 hover:bg-blue-100 hover:shadow-lg'
            : 'bg-white hover:shadow-xl'
        }
      `}
      onClick={onClick}
    >
      {name && !isAddAction && id ? ( // Existing room card
        <>
          <span className="text-lg md:text-xl font-semibold text-gray-800 px-4 text-center break-words">
            {name}
          </span>

          {/* Container for action buttons */}
          <div className="absolute top-2 right-2 flex items-center space-x-1">
            {/* Copy Button with visual feedback */}
            <button
              aria-label="Copy room link" // Updated aria-label
              title={copied ? "Copied!" : "Copy Room Link"} // Dynamic tooltip
              className={`p-1.5 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-1
                          ${copied
                            ? 'text-green-600 bg-green-100 focus:ring-green-400' // Style for copied state
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-100 focus:ring-blue-400' // Default style
                          }`}
              onClick={handleCopy}
            >
              {/* Show Check icon when copied, otherwise ClipboardCopy */}
              {copied ? <Check className="w-5 h-5" /> : <ClipboardCopy className="w-5 h-5" />}
            </button>

            {/* Delete Button */}
            {onDelete && (
              <button
                aria-label={`Delete room ${name}`}
                title="Delete Room"
                className="p-1.5 rounded-full text-gray-400 hover:text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 transition-colors duration-150"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </>
      ) : (
         // Add card
        <PlusCircle className="w-12 h-12 text-blue-500 group-hover:text-blue-600 transition-colors" />
      )}
    </div>
  );
};