import { db } from "../../db";
import { vehicles } from "../../db/schema";
import { asc, count, desc, eq, inArray } from "drizzle-orm";
import { vehiclePhotos } from "../../db/schema";

export async function getVehicles() {
  return db
    .select()
    .from(vehicles)
    .orderBy(desc(vehicles.createdAt));
}

export async function getVehicleById(id: number) {
  const [vehicle] = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.id, id))
    .limit(1);

  return vehicle;
}

export async function getVehicleStats() {
  const [total] = await db
    .select({
      count: count(),
    })
    .from(vehicles);

  const [available] = await db
    .select({
      count: count(),
    })
    .from(vehicles)
    .where(eq(vehicles.condition, "good"));

  const [pending] = await db
    .select({
      count: count(),
    })
    .from(vehicles)
    .where(eq(vehicles.condition, "pending"));

  return {
    total: total.count,
    available: available.count,
    pending: pending.count,
  };
}

export async function getVehiclePhotos(vehicleId: number) {
  return db
    .select()
    .from(vehiclePhotos)
    .where(eq(vehiclePhotos.vehicleId, vehicleId));
}

export async function getFirstVehiclePhotoPaths(vehicleIds: number[]) {
  if (vehicleIds.length === 0) {
    return [];
  }

  const photos = await db
    .select({
      vehicleId: vehiclePhotos.vehicleId,
      storagePath: vehiclePhotos.storagePath,
    })
    .from(vehiclePhotos)
    .where(inArray(vehiclePhotos.vehicleId, vehicleIds))
    .orderBy(asc(vehiclePhotos.createdAt), asc(vehiclePhotos.id));

  const firstPhotoByVehicle = new Map<number, (typeof photos)[number]>();

  for (const photo of photos) {
    if (!firstPhotoByVehicle.has(photo.vehicleId)) {
      firstPhotoByVehicle.set(photo.vehicleId, photo);
    }
  }

  return [...firstPhotoByVehicle.values()];
}