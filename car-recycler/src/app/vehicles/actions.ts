"use server";

import { db } from "../../db";
import { vehicles } from "../../db/schema";
import { eq } from "drizzle-orm";

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