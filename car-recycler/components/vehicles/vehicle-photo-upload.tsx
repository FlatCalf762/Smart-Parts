"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";

interface VehiclePhotoUploadProps {
  onFilesChange?: (files: File[]) => void;
}

export function VehiclePhotoUpload({
  onFilesChange,
}: VehiclePhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  function handleFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);

    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/"),
    );

    const combinedFiles = [...files, ...imageFiles];

    setFiles(combinedFiles);

    onFilesChange?.(combinedFiles);

    const newPreviews = imageFiles.map((file) =>
      URL.createObjectURL(file),
    );

    setPreviews((previous) => [...previous, ...newPreviews]);
  }

  function removeFile(index: number) {
    const updatedFiles = files.filter((_, i) => i !== index);
    const updatedPreviews = previews.filter((_, i) => i !== index);

    setFiles(updatedFiles);
    setPreviews(updatedPreviews);

    onFilesChange?.(updatedFiles);
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex min-h-40 w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/20 p-6 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/40"
      >
        <ImagePlus className="mb-3 h-8 w-8 text-muted-foreground" />

        <p className="font-medium">
          Upload vehicle photos
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Click to select images
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          JPG, PNG, or WEBP
        </p>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(event) => {
          handleFiles(event.target.files);

          // Allow selecting the same file again.
          event.target.value = "";
        }}
      />

      {/* Preview images */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {previews.map((preview, index) => (
            <div
              key={preview}
              className="group relative aspect-video overflow-hidden rounded-lg border bg-muted"
            >
              <img
                src={preview}
                alt={`Vehicle preview ${index + 1}`}
                className="h-full w-full object-cover"
              />

              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute right-2 top-2 h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => removeFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}