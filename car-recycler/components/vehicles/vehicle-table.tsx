import Link from "next/link";
import Image from "next/image";
import { Car } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { VehicleDeleteButton } from "@/components/vehicles/vehicle-delete-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  vin: string;
  condition: string;
  yardLocation: string | null;
  photoUrl?: string;
}

interface VehicleTableProps {
  vehicles: Vehicle[];
}

export function VehicleTable({ vehicles }: VehicleTableProps) {
  return (
    <div className="rounded-lg border bg-background">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Photo</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>VIN</TableHead>
            <TableHead>Condition</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-12">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id}>
              {/* Photo */}
              <TableCell>
                <Link href={`/vehicles/${vehicle.id}`}>
                  <div className="flex h-10 w-14 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {vehicle.photoUrl ? (
                      <Image
                        src={vehicle.photoUrl}
                        alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                        width={56}
                        height={40}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      <Car className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </Link>
              </TableCell>

              {/* Vehicle */}
              <TableCell>
                <Link
                  href={`/vehicles/${vehicle.id}`}
                  className="font-medium hover:underline"
                >
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </Link>
              </TableCell>

              {/* VIN */}
              <TableCell className="font-mono text-sm text-muted-foreground">
                {vehicle.vin}
              </TableCell>

              {/* Condition */}
              <TableCell>
                <Badge variant="secondary">
                  {vehicle.condition}
                </Badge>
              </TableCell>

              {/* Location */}
              <TableCell>
                {vehicle.yardLocation ?? "—"}
              </TableCell>

              <TableCell>
                <VehicleDeleteButton
                  vehicleId={vehicle.id}
                  vehicleName={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}