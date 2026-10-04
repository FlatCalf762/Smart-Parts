"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload } from "lucide-react";

import { uploadVehiclePhoto } from "@/src/app/vehicles/actions";

interface VehiclePhotoUploadProps {
  vehicleId: number;
}

export function VehiclePhotoUpload({
  vehicleId,
}: VehiclePhotoUploadProps) {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) {
      return;
    }

    setError("");
    setStatus("");
    setIsUploading(true);

    const selectedFiles = Array.from(files);
    const failures: string[] = [];
    let uploadedCount = 0;

    try {
      for (const file of selectedFiles) {
        const result = await uploadVehiclePhoto(vehicleId, file);

        if (!result.success) {
          failures.push(`${file.name}: ${result.error}`);
          continue;
        }

        uploadedCount += 1;
      }

      if (uploadedCount > 0) {
        setStatus(`Uploaded ${uploadedCount} photo${uploadedCount === 1 ? "" : "s"}.`);
        router.refresh();
      }

      setError(failures.join("\n"));
    } catch {
      setError("Photo upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Vehicle Photos</h2>

        <p className="text-sm text-muted-foreground">
          Upload photos of this vehicle.
        </p>
      </div>

      <label
        htmlFor="vehicle-photo-upload"
        className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition hover:bg-muted/50"
      >
        <Upload className="mb-3 h-8 w-8 text-muted-foreground" />

        <span className="font-medium">
          {isUploading ? "Uploading..." : "Upload photos"}
        </span>

        <span className="mt-1 text-sm text-muted-foreground">
          PNG, JPG, JPEG, or WebP up to 10 MB
        </span>

        <input
          id="vehicle-photo-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          disabled={isUploading}
          className="hidden"
          onChange={(event) => {
            handleFiles(event.target.files);

            // Allows selecting the same file again later.
            event.target.value = "";
          }}
        />
      </label>

      {error && (
        <p className="whitespace-pre-line text-sm text-red-600">
          {error}
        </p>
      )}

      {status && (
        <p className="text-sm text-green-700" role="status">
          {status}
        </p>
      )}
    </div>
  );
}