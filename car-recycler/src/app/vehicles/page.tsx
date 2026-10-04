import Link from "next/link";
import { Car, Plus } from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";

import { VehicleInventory } from "@/components/vehicles/vehicle-inventory";

import { getVehicles } from "../../db/queries/vehicles";

export default async function VehiclesPage() {
  const vehicles = await getVehicles();

  const vehicleData = vehicles.map((vehicle) => ({
    id: vehicle.id,
    year: vehicle.year,
    make: vehicle.make,
    model: vehicle.model,
    vin: vehicle.vin,
    condition: vehicle.condition,
    yardLocation: vehicle.yardLocation,
  }));

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-green-600" />

                <h1 className="text-3xl font-bold tracking-tight">
                  Vehicles
                </h1>
              </div>

              <p className="mt-1 text-muted-foreground">
                Manage vehicles currently in your inventory.
              </p>
            </div>

            <Link
              href="/vehicles/new"
              className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Vehicle
            </Link>
          </div>

          <VehicleInventory vehicles={vehicleData} />
        </main>
      </div>
    </div>
  );
}