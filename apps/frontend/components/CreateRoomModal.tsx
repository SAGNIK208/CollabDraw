// components/CreateRoomModal.tsx
"use client";

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateRoomSchema, CreateRoomFormData } from '@repo/common/types';
import { Button } from '@repo/ui/button';
import { X } from 'lucide-react';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string) => Promise<void>;
}

export const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ isOpen, onClose, onCreate }) => {
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateRoomFormData>({
    resolver: zodResolver(CreateRoomSchema),
    defaultValues: {
      name: '',
    },
  });

  const currentRoomName = watch('name');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        reset({ name: '' });
      }, 200);
    } else {
      reset(undefined, { keepValues: false, keepErrors: false });
    }
  }, [isOpen, reset]);

  const onSubmit: SubmitHandler<CreateRoomFormData> = async (data) => {
    try {
      await onCreate(data.name);
    } catch (err) {
      console.error("Create room error:", err);
      if(err instanceof Error){
        setError('root.serverError', {
            type: 'manual',
            message: err.message || 'Failed to create room. Please try again.',
          });
      }
    }
  };

  const handleAttemptClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  }

  const isCreateDisabled = isSubmitting || !currentRoomName?.trim();

  if (!isOpen) {
    return null;
  }

  return (
    // Modal Backdrop - Changed styling
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out
                  ${isOpen ? 'opacity-100' : 'opacity-0'}
                  bg-gray-300 bg-opacity-30 backdrop-blur-sm`} // <-- Updated: Light gray overlay + blur
      onClick={handleAttemptClose}
    >
      {/* Modal Content */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={`bg-white rounded-xl shadow-2xl p-6 w-full max-w-md transition-all duration-300 ease-in-out ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        noValidate
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Create New Room</h2>
          <button
            type="button"
            onClick={handleAttemptClose}
            className={`p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Close modal"
            // Disable button click itself if needed, though handleAttemptClose already checks
            disabled={isSubmitting}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="space-y-4">
          <label htmlFor="roomNameInput" className="block text-sm font-medium text-gray-700">
            Room Name
          </label>
          <input
            id="roomNameInput"
            type="text"
            {...register('name')}
            placeholder="Enter a name for your room"
            className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } ${isSubmitting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            autoFocus
            readOnly={isSubmitting}
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby="name-error server-error"
          />
          {errors.name && (
            <p id="name-error" className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
          {errors.root?.serverError && (
            <p id="server-error" className="text-sm text-red-600 mt-1">{errors.root.serverError.message}</p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <Button
            // type="button" // Handled by default Button type potentially, or add if needed
            label="Cancel"
            variant="secondary"
            onClick={handleAttemptClose}
            className={`transition-opacity ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
          <Button
            // type="submit" // Handled by form onSubmit, or add if needed
            label={isSubmitting ? "Creating..." : "Create"}
            variant="primary"
            onClick={handleSubmit(onSubmit)} // Explicitly trigger if Button isn't type="submit"
            className={`transition-opacity ${isCreateDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          />
        </div>
      </form>
    </div>
  );
};