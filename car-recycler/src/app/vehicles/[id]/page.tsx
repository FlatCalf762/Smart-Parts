import Link from "next/link";
import { ArrowLeft, Car } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const vehicles = [
  {
    id: 1,
    year: 2021,
    make: "Toyota",
    model: "Camry",
    vin: "4T1BF1FK5MU123456",
    condition: "Good",
    yardLocation: "A-12",
    mileage: 84321,
    color: "Silver",
    engine: "2.5L 4-Cylinder",
    transmission: "Automatic",
  },
  {
    id: 2,
    year: 2019,
    make: "Honda",
    model: "Civic",
    vin: "2HGFC2F59KH654321",
    condition: "Fair",
    yardLocation: "B-07",
    mileage: 112450,
    color: "Black",
    engine: "2.0L 4-Cylinder",
    transmission: "CVT",
  },
  {
    id: 4,
    year: 2022,
    make: "Ford",
    model: "F-150",
    vin: "1FTFW1E50NFA98765",
    condition: "Excellent",
    yardLocation: "C-03",
    mileage: 42100,
    color: "White",
    engine: "3.5L V6",
    transmission: "Automatic",
  },
];

interface VehicleDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const { id } = await params;

  const vehicle = vehicles.find((vehicle) => vehicle.id === Number(id));

  if (!vehicle) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Vehicle Not Found</h1>

          <p className="mt-2 text-muted-foreground">
            No vehicle exists with ID {id}.
          </p>

          <Link
            href="/vehicles"
            className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Vehicles
          </Link>
        </div>
      </main>
    );
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

          <Button>Edit Vehicle</Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vehicle Photo */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <div className="flex aspect-video items-center justify-center rounded-lg bg-muted">
                <Car className="h-20 w-20 text-muted-foreground" />
              </div>
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
                  {vehicle.mileage.toLocaleString()} miles
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-medium">{vehicle.color}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Engine</p>
                <p className="font-medium">{vehicle.engine}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Transmission</p>
                <p className="font-medium">{vehicle.transmission}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Yard Location</p>
                <p className="font-medium">{vehicle.yardLocation}</p>
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