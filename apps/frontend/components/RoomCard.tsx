import { PlusCircle, Trash2 } from "lucide-react";

export const RoomCard = ({ name, onClick, onDelete }: { name?: string; onClick: () => void; onDelete?: () => void }) => {
    return (
      <div
        className="w-72 h-40 bg-white border shadow-md flex items-center justify-center cursor-pointer rounded-xl relative hover:shadow-lg"
        onClick={onClick}
      >
        {name ? (
          <>
            <span className="text-xl font-semibold text-gray-800">{name}</span>
            {onDelete && (
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="w-6 h-6" />
              </button>
            )}
          </>
        ) : (
          <PlusCircle className="w-12 h-12 text-blue-500" />
        )}
      </div>
    );
};
