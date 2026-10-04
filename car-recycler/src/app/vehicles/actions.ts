"use server";

import { db } from "../../db";
import { vehiclePhotos, vehicles } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { createSupabaseServerClient } from "../../lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireEmployee } from "../../lib/auth/employee";

export interface CreateVehicleInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  color?: string;
  engine?: string;
  transmission?: string;
  condition: string;
  yardLocation?: string;
}

export interface UpdateVehicleInput {
  id: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  mileage?: number;
  color?: string;
  engine?: string;
  transmission?: string;
  condition: string;
  yardLocation?: string;
}

type CreateVehicleResult =
  | {
      success: true;
      vehicle: typeof vehicles.$inferSelect;
    }
  | {
      success: false;
      error: string;
    };

    type UpdateVehicleResult =
  | {
      success: true;
      vehicle: typeof vehicles.$inferSelect;
    }
  | {
      success: false;
      error: string;
    };

export async function createVehicle(
  data: CreateVehicleInput
): Promise<CreateVehicleResult> {
  await requireEmployee();

  try {
    const [vehicle] = await db
      .insert(vehicles)
      .values({
        vin: data.vin,
        year: data.year,
        make: data.make,
        model: data.model,
        mileage: data.mileage,
        color: data.color,
        engine: data.engine,
        transmission: data.transmission,
        condition: data.condition,
        yardLocation: data.yardLocation,
      })
      .returning();

    return {
      success: true,
      vehicle,
    };
  } catch (error) {
    console.error("Failed to create vehicle:", error);

    return {
      success: false,
      error: "Failed to create vehicle.",
    };
  }
}

export async function updateVehicle(
  data: UpdateVehicleInput
): Promise<UpdateVehicleResult> {
  await requireEmployee();

  try {
    const [vehicle] = await db
      .update(vehicles)
      .set({
        vin: data.vin,
        year: data.year,
        make: data.make,
        model: data.model,
        mileage: data.mileage,
        color: data.color,
        engine: data.engine,
        transmission: data.transmission,
        condition: data.condition,
        yardLocation: data.yardLocation,
        updatedAt: new Date(),
      })
      .where(eq(vehicles.id, data.id))
      .returning();

    if (!vehicle) {
      return {
        success: false,
        error: "Vehicle not found.",
      };
    }

    return {
      success: true,
      vehicle,
    };
  } catch (error) {
    console.error("Failed to update vehicle:", error);

    return {
      success: false,
      error: "Failed to update vehicle.",
    };
  }
}

export async function uploadVehiclePhoto(
  vehicleId: number,
  file: File
): Promise<
  | {
      success: true;
      photo: typeof vehiclePhotos.$inferSelect;
    }
  | {
      success: false;
      error: string;
    }
> {
  await requireEmployee();

  try {
    const [vehicle] = await db
      .select()
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .limit(1);

    if (!vehicle) {
      return {
        success: false,
        error: "Vehicle not found.",
      };
    }

    if (!file.type.startsWith("image/")) {
      return {
        success: false,
        error: "Only image files are allowed.",
      };
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return {
        success: false,
        error: "Image must be smaller than 10 MB.",
      };
    }

    const supabase = await createSupabaseServerClient();

    const fileExtension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName = `${crypto.randomUUID()}.${fileExtension}`;

    const storagePath = `vehicles/${vehicleId}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("inventory-photos")
      .upload(storagePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Supabase upload error:", uploadError);

      return {
        success: false,
        error: "Failed to upload photo.",
      };
    }

    const [photo] = await db
      .insert(vehiclePhotos)
      .values({
        vehicleId,
        storagePath,
      })
      .returning();

    return {
      success: true,
      photo,
    };
  } catch (error) {
    console.error("Failed to upload vehicle photo:", error);

    return {
      success: false,
      error: "Failed to upload vehicle photo.",
    };
  }
}

export async function deleteVehiclePhoto(
  vehicleId: number,
  photoId: number
): Promise<
  | { success: true }
  | { success: false; error: string }
> {
  await requireEmployee();

  if (
    !Number.isInteger(vehicleId) ||
    vehicleId < 1 ||
    !Number.isInteger(photoId) ||
    photoId < 1
  ) {
    return { success: false, error: "Invalid photo." };
  }

  try {
    const [photo] = await db
      .select()
      .from(vehiclePhotos)
      .where(
        and(
          eq(vehiclePhotos.id, photoId),
          eq(vehiclePhotos.vehicleId, vehicleId)
        )
      )
      .limit(1);

    if (!photo) {
      return { success: false, error: "Photo not found." };
    }

    const supabase = await createSupabaseServerClient();
    const { error: storageError } = await supabase.storage
      .from("inventory-photos")
      .remove([photo.storagePath]);

    if (storageError) {
      console.error("Supabase photo deletion error:", storageError);
      return { success: false, error: "Failed to delete photo." };
    }

    await db
      .delete(vehiclePhotos)
      .where(
        and(
          eq(vehiclePhotos.id, photoId),
          eq(vehiclePhotos.vehicleId, vehicleId)
        )
      );

    revalidatePath(`/vehicles/${vehicleId}`);

    return { success: true };
  } catch (error) {
    console.error("Failed to delete vehicle photo:", error);
    return { success: false, error: "Failed to delete photo." };
  }
}

export async function deleteVehicle(
  vehicleId: number
): Promise<
  | { success: true }
  | { success: false; error: string }
> {
  await requireAdmin();

  if (!Number.isInteger(vehicleId) || vehicleId < 1) {
    return { success: false, error: "Invalid vehicle." };
  }

  try {
    const [vehicle] = await db
      .select({ id: vehicles.id })
      .from(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .limit(1);

    if (!vehicle) {
      return { success: false, error: "Vehicle not found." };
    }

    const photos = await db
      .select({ storagePath: vehiclePhotos.storagePath })
      .from(vehiclePhotos)
      .where(eq(vehiclePhotos.vehicleId, vehicleId));

    if (photos.length > 0) {
      const supabase = await createSupabaseServerClient();
      const { error: storageError } = await supabase.storage
        .from("inventory-photos")
        .remove(photos.map((photo) => photo.storagePath));

      if (storageError) {
        console.error("Supabase vehicle photo deletion error:", storageError);
        return {
          success: false,
          error: "Failed to delete the vehicle's photos.",
        };
      }
    }

    const [deletedVehicle] = await db
      .delete(vehicles)
      .where(eq(vehicles.id, vehicleId))
      .returning({ id: vehicles.id });

    if (!deletedVehicle) {
      return { success: false, error: "Vehicle not found." };
    }

    revalidatePath("/vehicles");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Failed to delete vehicle:", error);
    return { success: false, error: "Failed to delete vehicle." };
  }
}
