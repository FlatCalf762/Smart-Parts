"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteVehiclePhoto } from "@/src/app/vehicles/actions";

interface VehiclePhotoDeleteButtonProps {
  vehicleId: number;
  photoId: number;
}

export function VehiclePhotoDeleteButton({
  vehicleId,
  photoId,
}: VehiclePhotoDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!window.confirm("Delete this vehicle photo? This cannot be undone.")) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const result = await deleteVehiclePhoto(vehicleId, photoId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch {
      setError("Failed to delete photo. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label="Delete photo"
        title="Delete photo"
        className="absolute right-2 top-2 inline-flex size-9 items-center justify-center rounded-md bg-black/70 text-white opacity-100 transition hover:bg-red-700 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white md:opacity-0 md:group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Trash2 className="size-4" />
      </button>
      {error && (
        <p className="absolute inset-x-0 bottom-0 bg-red-700/90 px-2 py-1 text-xs text-white" role="alert">
          {error}
        </p>
      )}
    </>
  );
}