"use server";

import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { db } from "@/src/db";
import { employees, inventorySettings } from "@/src/db/schema";
import { requireAdmin, requireEmployee } from "@/src/lib/auth/employee";
import { createSupabaseAdminClient } from "@/src/lib/supabase/admin";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

type ActionResult =
  | { success: true; message?: string }
  | { success: false; error: string };

async function countAdmins() {
  const [result] = await db
    .select({ total: count() })
    .from(employees)
    .where(and(eq(employees.role, "admin"), eq(employees.active, true)));

  return result.total;
}

export async function inviteEmployee(input: {
  email: string;
  fullName: string;
}): Promise<ActionResult> {
  await requireAdmin();

  if (
    !input ||
    typeof input.email !== "string" ||
    typeof input.fullName !== "string"
  ) {
    return { success: false, error: "Enter an employee name and email." };
  }

  const email = input.email.trim().toLowerCase();
  const fullName = input.fullName.trim();

  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return { success: false, error: "Enter a valid work email." };
  }

  if (fullName.length < 2 || fullName.length > 100) {
    return { success: false, error: "Enter a name between 2 and 100 characters." };
  }

  try {
    const [existingEmployee] = await db
      .select({ authUserId: employees.authUserId })
      .from(employees)
      .where(eq(employees.email, email))
      .limit(1);

    if (existingEmployee) {
      return { success: false, error: "An employee with that email already exists." };
    }

    const supabase = createSupabaseAdminClient();
    const siteUrl = (
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ).replace(/\/$/, "");
    const inviteRedirect = new URL("/auth/callback", siteUrl);
    inviteRedirect.searchParams.set("next", "/settings?setup=password");
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: inviteRedirect.toString(),
      data: { full_name: fullName },
    });

    if (error || !data.user) {
      console.error("Failed to invite employee:", error);
      return { success: false, error: "Could not send the employee invitation." };
    }

    try {
      await db.insert(employees).values({
        authUserId: data.user.id,
        email,
        fullName,
        role: "employee",
      });
    } catch (error) {
      await supabase.auth.admin.deleteUser(data.user.id);
      throw error;
    }

    revalidatePath("/settings");
    return { success: true, message: `Invitation sent to ${email}.` };
  } catch (error) {
    console.error("Failed to invite employee:", error);
    return { success: false, error: "Could not send the employee invitation." };
  }
}

export async function updateEmployeeRole(
  authUserId: string,
  role: "admin" | "employee"
): Promise<ActionResult> {
  const currentEmployee = await requireAdmin();

  if (!authUserId || !["admin", "employee"].includes(role)) {
    return { success: false, error: "Invalid employee or role." };
  }

  if (authUserId === currentEmployee.authUserId && role !== "admin") {
    return { success: false, error: "You cannot remove your own admin role." };
  }

  if (authUserId === process.env.INITIAL_ADMIN_USER_ID && role !== "admin") {
    return { success: false, error: "The bootstrap administrator must remain an admin." };
  }

  try {
    const [target] = await db
      .select()
      .from(employees)
      .where(eq(employees.authUserId, authUserId))
      .limit(1);

    if (!target) {
      return { success: false, error: "Employee not found." };
    }

    if (target.active && target.role === "admin" && role !== "admin" && await countAdmins() <= 1) {
      return { success: false, error: "At least one active administrator is required." };
    }

    await db
      .update(employees)
      .set({ role, updatedAt: new Date() })
      .where(eq(employees.authUserId, authUserId));

    revalidatePath("/settings");
    return { success: true, message: "Employee role updated." };
  } catch (error) {
    console.error("Failed to update employee role:", error);
    return { success: false, error: "Could not update the employee role." };
  }
}

export async function removeEmployee(authUserId: string): Promise<ActionResult> {
  const currentEmployee = await requireAdmin();

  if (
    !authUserId ||
    authUserId === currentEmployee.authUserId ||
    authUserId === process.env.INITIAL_ADMIN_USER_ID
  ) {
    return { success: false, error: "This employee account cannot be removed." };
  }

  try {
    const [target] = await db
      .select()
      .from(employees)
      .where(eq(employees.authUserId, authUserId))
      .limit(1);

    if (!target) {
      return { success: false, error: "Employee not found." };
    }

    if (target.active && target.role === "admin" && await countAdmins() <= 1) {
      return { success: false, error: "At least one active administrator is required." };
    }

    const supabase = createSupabaseAdminClient();
    const { error } = await supabase.auth.admin.deleteUser(authUserId);

    if (error) {
      console.error("Failed to remove employee auth account:", error);
      return { success: false, error: "Could not remove the employee account." };
    }

    await db.delete(employees).where(eq(employees.authUserId, authUserId));
    revalidatePath("/settings");
    return { success: true, message: `${target.fullName} was removed.` };
  } catch (error) {
    console.error("Failed to remove employee:", error);
    return { success: false, error: "Could not remove the employee account." };
  }
}

export async function saveInventoryDefaults(input: {
  vehicleConditions: string[];
  yardLocations: string[];
}): Promise<ActionResult> {
  await requireAdmin();

  if (!input || !Array.isArray(input.vehicleConditions) || !Array.isArray(input.yardLocations)) {
    return { success: false, error: "Enter valid inventory defaults." };
  }

  function normalizeOptions(values: unknown, allowEmpty: boolean) {
    if (!Array.isArray(values) || values.some((value) => typeof value !== "string")) {
      return null;
    }

    const normalized = [...new Set(values.map((value) => value.trim()).filter(Boolean))];

    if (
      normalized.some((value) => value.length > 80) ||
      normalized.length > 50 ||
      (!allowEmpty && normalized.length === 0)
    ) {
      return null;
    }

    return normalized;
  }

  const vehicleConditions = normalizeOptions(input.vehicleConditions, false);
  const yardLocations = normalizeOptions(input.yardLocations, true);

  if (!vehicleConditions || !yardLocations) {
    return { success: false, error: "Enter valid options, one per line (maximum 50)." };
  }

  try {
    await db
      .insert(inventorySettings)
      .values({
        id: 1,
        vehicleConditions: vehicleConditions.join("\n"),
        yardLocations: yardLocations.join("\n"),
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: inventorySettings.id,
        set: {
          vehicleConditions: vehicleConditions.join("\n"),
          yardLocations: yardLocations.join("\n"),
          updatedAt: new Date(),
        },
      });

    revalidatePath("/settings");
    revalidatePath("/vehicles/new");
    revalidatePath("/vehicles/[id]/edit", "page");
    return { success: true, message: "Inventory defaults saved." };
  } catch (error) {
    console.error("Failed to save inventory defaults:", error);
    return { success: false, error: "Could not save inventory defaults." };
  }
}

export async function updateOwnPassword(input: {
  password: string;
  confirmPassword: string;
}): Promise<ActionResult> {
  await requireEmployee();

  if (
    !input ||
    typeof input.password !== "string" ||
    typeof input.confirmPassword !== "string"
  ) {
    return { success: false, error: "Enter and confirm a new password." };
  }

  if (input.password.length < 10) {
    return { success: false, error: "Use a password with at least 10 characters." };
  }

  if (input.password !== input.confirmPassword) {
    return { success: false, error: "The passwords do not match." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: input.password });

  if (error) {
    console.error("Failed to update account password:", error);
    return { success: false, error: "Could not update your password." };
  }

  return { success: true, message: "Password updated." };
}