"use client";

import { useState } from "react";
import Link from "next/link";

export interface VehicleFormData {
  vin: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
  color: string;
  engine: string;
  transmission: string;
  condition: string;
  yardLocation: string;
}

interface VehicleFormProps {
  initialData?: VehicleFormData;
  conditionOptions?: string[];
  yardLocations?: string[];
  onSubmit?: (data: VehicleFormData) => void | Promise<void>;
}

const defaultConditionOptions = ["pending", "excellent", "good", "fair", "poor"];

const defaultFormData: VehicleFormData = {
  vin: "",
  year: "",
  make: "",
  model: "",
  mileage: "",
  color: "",
  engine: "",
  transmission: "",
  condition: "pending",
  yardLocation: "",
};

export function VehicleForm({
  initialData,
  conditionOptions = defaultConditionOptions,
  yardLocations = [],
  onSubmit,
}: VehicleFormProps) {
  const [formData, setFormData] = useState<VehicleFormData>(
    initialData ?? defaultFormData
  );
  const availableConditions = conditionOptions.includes(formData.condition)
    ? conditionOptions
    : [formData.condition, ...conditionOptions];

  function updateField(
    field: keyof VehicleFormData,
    value: string
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (onSubmit) {
      await onSubmit(formData);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div>
        <h2 className="text-lg font-semibold">
          Basic Information
        </h2>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              VIN
            </label>

            <input
              value={formData.vin}
              onChange={(event) =>
                updateField("vin", event.target.value)
              }
              maxLength={17}
              required
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Vehicle Identification Number"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Year
            </label>

            <input
              type="number"
              value={formData.year}
              onChange={(event) =>
                updateField("year", event.target.value)
              }
              required
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="2024"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Make
            </label>

            <input
              value={formData.make}
              onChange={(event) =>
                updateField("make", event.target.value)
              }
              required
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Toyota"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Model
            </label>

            <input
              value={formData.model}
              onChange={(event) =>
                updateField("model", event.target.value)
              }
              required
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Camry"
            />
          </div>
        </div>
      </div>

      {/* Vehicle Details */}
      <div>
        <h2 className="text-lg font-semibold">
          Vehicle Details
        </h2>

        <div className="mt-4 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">
              Mileage
            </label>

            <input
              type="number"
              value={formData.mileage}
              onChange={(event) =>
                updateField("mileage", event.target.value)
              }
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="85000"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Color
            </label>

            <input
              value={formData.color}
              onChange={(event) =>
                updateField("color", event.target.value)
              }
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Silver"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Engine
            </label>

            <input
              value={formData.engine}
              onChange={(event) =>
                updateField("engine", event.target.value)
              }
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="2.5L I4"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Transmission
            </label>

            <input
              value={formData.transmission}
              onChange={(event) =>
                updateField(
                  "transmission",
                  event.target.value
                )
              }
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Automatic"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Condition
            </label>

            <select
              value={formData.condition}
              onChange={(event) =>
                updateField(
                  "condition",
                  event.target.value
                )
              }
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            >
              {availableConditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition.charAt(0).toUpperCase() + condition.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">
              Yard Location
            </label>

            <input
              value={formData.yardLocation}
              list="vehicle-yard-locations"
              onChange={(event) =>
                updateField(
                  "yardLocation",
                  event.target.value
                )
              }
              className="mt-2 flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="A-12"
            />
            <datalist id="vehicle-yard-locations">
              {yardLocations.map((location) => (
                <option key={location} value={location} />
              ))}
            </datalist>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 border-t pt-6">
        <Link
          href="/vehicles"
          className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium transition-colors hover:bg-muted"
        >
          Cancel
        </Link>

        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700"
        >
          Save Vehicle
        </button>
      </div>
    </form>
  );
}