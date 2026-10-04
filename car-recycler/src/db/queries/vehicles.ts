import { db } from "../../db";
import { vehicles } from "../../db/schema";
import { count, desc, eq } from "drizzle-orm";

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