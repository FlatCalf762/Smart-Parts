import { and, asc, eq } from "drizzle-orm";

import { db } from "../../db";
import { employees, inventorySettings } from "../schema";

const defaultConditions = ["pending", "excellent", "good", "fair", "poor"];

function parseLines(value: string | undefined, fallback: string[] = []) {
  const lines = [...new Set((value ?? "").split(/\r?\n/).map((line) => line.trim()).filter(Boolean))];
  return lines.length > 0 ? lines : fallback;
}

export async function getInventoryDefaults() {
  const [settings] = await db
    .select()
    .from(inventorySettings)
    .where(eq(inventorySettings.id, 1))
    .limit(1);

  return {
    vehicleConditions: parseLines(settings?.vehicleConditions, defaultConditions),
    yardLocations: parseLines(settings?.yardLocations),
  };
}

export async function getEmployees() {
  return db
    .select({
      authUserId: employees.authUserId,
      email: employees.email,
      fullName: employees.fullName,
      role: employees.role,
      active: employees.active,
    })
    .from(employees)
    .orderBy(asc(employees.fullName));
}

export async function hasActiveAdmin() {
  const [admin] = await db
    .select({ authUserId: employees.authUserId })
    .from(employees)
    .where(and(eq(employees.role, "admin"), eq(employees.active, true)))
    .limit(1);

  return Boolean(admin);
}