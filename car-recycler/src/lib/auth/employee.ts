import "server-only";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "../../db";
import { employees } from "../../db/schema";
import { createSupabaseServerClient } from "../supabase/server";

export async function getCurrentEmployee() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getClaims();
  const claims = data?.claims;
  const authUserId = claims?.sub;

  if (error || !claims || typeof authUserId !== "string") {
    return null;
  }

  const email = typeof claims.email === "string"
    ? claims.email.trim().toLowerCase()
    : "";
  const initialAdminUserId = process.env.INITIAL_ADMIN_USER_ID;

  if (email && authUserId === initialAdminUserId) {
    const [admin] = await db
      .insert(employees)
      .values({
        authUserId,
        email,
        fullName: email.split("@")[0],
        role: "admin",
        active: true,
      })
      .onConflictDoUpdate({
        target: employees.authUserId,
        set: { email, role: "admin", active: true, updatedAt: new Date() },
      })
      .returning();

    return admin;
  }

  const [employee] = await db
    .select()
    .from(employees)
    .where(eq(employees.authUserId, authUserId))
    .limit(1);

  return employee?.active ? employee : null;
}

export async function requireEmployee() {
  const employee = await getCurrentEmployee();

  if (!employee) {
    redirect("/login?reason=access");
  }

  return employee;
}

export async function requireAdmin() {
  const employee = await requireEmployee();

  if (employee.role !== "admin") {
    redirect("/dashboard");
  }

  return employee;
}