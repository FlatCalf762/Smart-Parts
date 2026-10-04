import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

import { getVehicleById } from "@/src/db/queries/vehicles";

import { EditVehicleForm } from "./edit-vehicle-form";

interface EditVehiclePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditVehiclePage({
  params,
}: EditVehiclePageProps) {
  const { id } = await params;

  const vehicleId = Number(id);

  if (!Number.isInteger(vehicleId)) {
    notFound();
  }

  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) {
    notFound();
  }

  const initialData = {
    vin: vehicle.vin,
    year: vehicle.year.toString(),
    make: vehicle.make,
    model: vehicle.model,
    mileage: vehicle.mileage?.toString() ?? "",
    color: vehicle.color ?? "",
    engine: vehicle.engine ?? "",
    transmission: vehicle.transmission ?? "",
    condition: vehicle.condition,
    yardLocation: vehicle.yardLocation ?? "",
  };

  return (
    <main className="min-h-screen bg-muted/30 p-6">
      <div className="mx-auto max-w-4xl">
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="mb-6 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vehicle
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Edit Vehicle
          </h1>

          <p className="mt-2 text-muted-foreground">
            Update information for {vehicle.year}{" "}
            {vehicle.make} {vehicle.model}.
          </p>
        </div>

        <div className="rounded-lg border bg-background p-6">
          <EditVehicleForm
            vehicleId={vehicle.id}
            initialData={initialData}
          />
        </div>
      </div>
    </main>
  );
}