import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface VehicleCardProps {
  id: number;
  year: number;
  make: string;
  model: string;
  vin: string;
  condition: string;
  yardLocation: string | null;
  photoUrl?: string;
}

export function VehicleCard({
  id,
  year,
  make,
  model,
  vin,
  condition,
  yardLocation,
  photoUrl,
}: VehicleCardProps) {
  return (
    <Link href={`/vehicles/${id}`}>
      <Card className="overflow-hidden transition-shadow hover:shadow-md">
        {/* Vehicle image */}
        <div className="aspect-video w-full bg-muted">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={`${year} ${make} ${model}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No photo
            </div>
          )}
        </div>

        <CardContent className="space-y-3 p-4">
          {/* Vehicle name */}
          <div>
            <h3 className="font-semibold">
              {year} {make} {model}
            </h3>

            <p className="text-sm text-muted-foreground">
              VIN: {vin}
            </p>
          </div>

          {/* Vehicle information */}
          <div className="flex items-center justify-between">
            <Badge variant="secondary">
              {condition}
            </Badge>

            {yardLocation && (
              <span className="text-sm text-muted-foreground">
                {yardLocation}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}