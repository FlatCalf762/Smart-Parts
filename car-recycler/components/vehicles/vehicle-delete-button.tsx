"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { deleteVehicle } from "@/src/app/vehicles/actions";

interface VehicleDeleteButtonProps {
  vehicleId: number;
  vehicleName: string;
}

export function VehicleDeleteButton({
  vehicleId,
  vehicleName,
}: VehicleDeleteButtonProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${vehicleName} and its associated parts and photos? This cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      const result = await deleteVehicle(vehicleId);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
    } catch {
      setError("Failed to delete vehicle. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        aria-label={`Delete ${vehicleName}`}
        title="Delete vehicle"
        className="inline-flex size-8 items-center justify-center rounded-md text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Trash2 className="size-4" />
      </button>
      {error && (
        <p className="max-w-48 text-right text-xs text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}