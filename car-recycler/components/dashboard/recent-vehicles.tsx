import Link from "next/link";
import { ArrowRight, Car } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { getVehicles } from "@/src/db/queries/vehicles";

export async function RecentVehicles() {
  const vehicles = await getVehicles();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Vehicles</CardTitle>

          <p className="mt-1 text-sm text-muted-foreground">
            Recently added vehicles
          </p>
        </div>

        <Link
          href="/vehicles"
          className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-muted"
        >
          View all
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </CardHeader>

      <CardContent>
        {vehicles.length === 0 ? (
          <div className="py-8 text-center">
            <Car className="mx-auto h-10 w-10 text-muted-foreground" />

            <p className="mt-3 font-medium">
              No vehicles yet
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Add a vehicle to see it here.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {vehicles.slice(0, 5).map((vehicle) => (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="flex items-center justify-between gap-4 py-4 transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                    <Car className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <div>
                    <p className="font-medium">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      VIN: {vehicle.vin}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <Badge variant="secondary">
                    {vehicle.condition}
                  </Badge>

                  {vehicle.yardLocation && (
                    <span className="hidden text-sm text-muted-foreground sm:block">
                      {vehicle.yardLocation}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}