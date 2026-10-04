"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  VehicleForm,
  type VehicleFormData,
} from "@/components/vehicles/vehicle-form";

import { updateVehicle } from "../../actions";

interface EditVehicleFormProps {
  vehicleId: number;
  initialData: VehicleFormData;
}

export function EditVehicleForm({
  vehicleId,
  initialData,
}: EditVehicleFormProps) {
  const router = useRouter();

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: VehicleFormData) {
    setError("");
    setIsSubmitting(true);

    const result = await updateVehicle({
      id: vehicleId,

      vin: data.vin.trim().toUpperCase(),

      year: Number(data.year),

      make: data.make.trim(),

      model: data.model.trim(),

      mileage: data.mileage
        ? Number(data.mileage)
        : undefined,

      color: data.color.trim() || undefined,

      engine: data.engine.trim() || undefined,

      transmission: data.transmission.trim() || undefined,

      condition: data.condition,

      yardLocation: data.yardLocation.trim() || undefined,
    });

    if (!result.success) {
      setError(result.error);
      setIsSubmitting(false);
      return;
    }

    router.push(`/vehicles/${vehicleId}`);
    router.refresh();
  }

  return (
    <>
      <VehicleForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />

      {error && (
        <p className="mt-4 text-sm text-red-600">
          {error}
        </p>
      )}

      {isSubmitting && (
        <p className="mt-4 text-sm text-muted-foreground">
          Saving changes...
        </p>
      )}
    </>
  );
}