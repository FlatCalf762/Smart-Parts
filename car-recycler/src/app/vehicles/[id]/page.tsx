import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { VehiclePhotoUpload } from "@/components/vehicles/vehicle-photo-upload";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehiclePhotoGallery } from "@/components/vehicles/vehicle-photo-gallery";
import { getVehicleById } from "@/src/db/queries/vehicles";
import { requireEmployee } from "@/src/lib/auth/employee";

interface VehicleDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  await requireEmployee();
  const { id } = await params;
  const vehicleId = Number(id);

  if (!Number.isInteger(vehicleId)) {
    notFound();
  }

  const vehicle = await getVehicleById(vehicleId);

  if (!vehicle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl p-6">
        <div className="mb-6">
          <Link
            href="/vehicles"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicles
          </Link>
        </div>

        <div className="mb-6 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h1>

              <Badge variant="secondary">{vehicle.condition}</Badge>
            </div>

            <p className="mt-2 font-mono text-sm text-muted-foreground">
              VIN: {vehicle.vin}
            </p>
          </div>

          <Link
            href={`/vehicles/${vehicle.id}/edit`}
            className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/80"
          >
            Edit Vehicle
          </Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vehicle Photo */}
          <Card className="lg:col-span-2">
            <CardContent className="space-y-6 p-6">
              <VehiclePhotoUpload vehicleId={vehicle.id} />
              <VehiclePhotoGallery vehicleId={vehicle.id} />
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Mileage</p>
                <p className="font-medium">
                  {vehicle.mileage !== null
                    ? `${vehicle.mileage.toLocaleString()} miles`
                    : "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{vehicle.color ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Engine</p>
                <p className="font-medium">{vehicle.engine ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Transmission</p>
                <p className="font-medium">{vehicle.transmission ?? "Not provided"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Yard Location</p>
                <p className="font-medium">{vehicle.yardLocation ?? "Not provided"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Parts */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Parts from this Vehicle</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">
              Parts associated with this vehicle will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}