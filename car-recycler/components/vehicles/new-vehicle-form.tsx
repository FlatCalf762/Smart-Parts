"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { VehicleForm } from "@/components/vehicles/vehicle-form";
import type { VehicleFormData } from "@/components/vehicles/vehicle-form";
import { createVehicle } from "@/src/app/vehicles/actions";

interface NewVehicleFormProps {
  conditionOptions: string[];
  yardLocations: string[];
}

export function NewVehicleForm({
  conditionOptions,
  yardLocations,
}: NewVehicleFormProps) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(data: VehicleFormData) {
    setError("");
    setIsSubmitting(true);

    try {
      const result = await createVehicle({
        vin: data.vin.trim().toUpperCase(),
        year: Number(data.year),
        make: data.make.trim(),
        model: data.model.trim(),
        mileage: data.mileage ? Number(data.mileage) : undefined,
        color: data.color.trim() || undefined,
        engine: data.engine.trim() || undefined,
        transmission: data.transmission.trim() || undefined,
        condition: data.condition,
        yardLocation: data.yardLocation.trim() || undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.push("/vehicles");
      router.refresh();
    } catch {
      setError("Could not add the vehicle. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/vehicles"
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicles
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Vehicle</h1>
          <p className="mt-2 text-muted-foreground">
            Add a vehicle to your inventory.
          </p>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <VehicleForm
            conditionOptions={conditionOptions}
            yardLocations={yardLocations}
            onSubmit={handleSubmit}
          />

          {error && (
            <p className="mt-4 text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {isSubmitting && (
            <p className="mt-4 text-sm text-muted-foreground" role="status">
              Adding vehicle...
            </p>
          )}
        </div>
      </div>
    </main>
  );
}