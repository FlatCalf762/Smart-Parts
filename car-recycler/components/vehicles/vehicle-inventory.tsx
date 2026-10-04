"use client";

import { useState } from "react";

import { Car } from "lucide-react";

import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import {
  VehicleTable,
  type Vehicle,
} from "@/components/vehicles/vehicle-table";

interface VehicleInventoryProps {
  vehicles: Vehicle[];
}

export function VehicleInventory({
  vehicles,
}: VehicleInventoryProps) {
  const [search, setSearch] = useState("");

  const filteredVehicles = vehicles.filter((vehicle) => {
    const query = search.toLowerCase();

    return (
      vehicle.vin.toLowerCase().includes(query) ||
      vehicle.make.toLowerCase().includes(query) ||
      vehicle.model.toLowerCase().includes(query) ||
      vehicle.year.toString().includes(query) ||
      vehicle.yardLocation?.toLowerCase().includes(query)
    );
  });

  return (
    <>
      <div className="mb-6">
        <VehicleFilters
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Inventory
          </h2>

          <p className="text-sm text-muted-foreground">
            {filteredVehicles.length}{" "}
            {filteredVehicles.length === 1
              ? "vehicle"
              : "vehicles"}{" "}
            found
          </p>
        </div>
      </div>

      {filteredVehicles.length > 0 ? (
        <VehicleTable vehicles={filteredVehicles} />
      ) : (
        <div className="rounded-lg border bg-background p-12 text-center">
          <Car className="mx-auto h-12 w-12 text-muted-foreground" />

          <h3 className="mt-4 text-lg font-semibold">
            No vehicles found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Try changing your search or add a new vehicle
            to your inventory.
          </p>
        </div>
      )}
    </>
  );
}