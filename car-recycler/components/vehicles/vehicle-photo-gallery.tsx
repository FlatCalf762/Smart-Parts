import Image from "next/image";

import { getVehiclePhotos } from "../../src/db/queries/vehicles";
import { getVehiclePhotoUrl } from "../../src/lib/supabase/vehicle-photos";
import { VehiclePhotoDeleteButton } from "./vehicle-photo-delete-button";

interface VehiclePhotoGalleryProps {
  vehicleId: number;
}

export async function VehiclePhotoGallery({
  vehicleId,
}: VehiclePhotoGalleryProps) {
  const photos = await getVehiclePhotos(vehicleId);

  if (photos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No photos have been uploaded for this vehicle.
        </p>
      </div>
    );
  }

  const photosWithUrls = await Promise.all(
    photos.map(async (photo) => ({
      ...photo,
      url: await getVehiclePhotoUrl(photo.storagePath),
    }))
  );

  const validPhotos = photosWithUrls.filter(
    (photo) => photo.url !== null
  );

  if (validPhotos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Unable to load vehicle photos.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {validPhotos.map((photo) => (
        <div
          key={photo.id}
          className="group relative overflow-hidden rounded-lg border"
        >
          <Image
            src={photo.url!}
            alt="Vehicle photo"
            width={600}
            height={450}
            className="aspect-video w-full object-cover"
            unoptimized
          />
          <VehiclePhotoDeleteButton
            vehicleId={vehicleId}
            photoId={photo.id}
          />
        </div>
      ))}
    </div>
  );
}