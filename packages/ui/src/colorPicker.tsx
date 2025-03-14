"use client";

import React, { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import { SketchPicker } from "react-color";
import { Button } from "./button";
import { LucidePalette } from "lucide-react";

interface ColorPickerProps {
  color: string | null | undefined;
  onChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange }) => {
  const [open, setOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(color || "#000000");

  const handleChange = (newColor: any) => {
    setSelectedColor(newColor.hex);
    onChange(newColor.hex);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          label="Pick Color"
          variant="outline"
          icon={LucidePalette}
          className="px-3 py-2"
        />
      </Popover.Trigger>
      <Popover.Content className="z-50 p-2 bg-white shadow-lg rounded-lg border">
        <SketchPicker color={selectedColor} onChange={handleChange} />
      </Popover.Content>
    </Popover.Root>
  );
};
