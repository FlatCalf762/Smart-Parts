"use server";

import { timingSafeEqual } from "node:crypto";
import { and, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { db } from "@/src/db";
import { employees } from "@/src/db/schema";
import { createSupabaseAdminClient } from "@/src/lib/supabase/admin";
import { createSupabaseServerClient } from "@/src/lib/supabase/server";

export interface LoginFormState {
  error?: string;
}

export interface InitialAdminFormState {
  error?: string;
  success?: string;
}

export async function createInitialAdmin(
  _previousState: InitialAdminFormState,
  formData: FormData
): Promise<InitialAdminFormState> {
  const setupToken = String(formData.get("setupToken") ?? "");
  const expectedToken = process.env.INITIAL_ADMIN_SETUP_TOKEN;

  if (
    process.env.INITIAL_ADMIN_SETUP_ENABLED !== "true" ||
    !expectedToken
  ) {
    return { error: "Initial admin setup is not enabled on this server." };
  }

  const providedTokenBytes = Buffer.from(setupToken);
  const expectedTokenBytes = Buffer.from(expectedToken);

  if (
    providedTokenBytes.length !== expectedTokenBytes.length ||
    !timingSafeEqual(providedTokenBytes, expectedTokenBytes)
  ) {
    return { error: "The setup token is not valid." };
  }

  if (process.env.INITIAL_ADMIN_USER_ID) {
    return { error: "An initial administrator is already configured." };
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (fullName.length < 2 || fullName.length > 100) {
    return { error: "Enter a name between 2 and 100 characters." };
  }

  if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
    return { error: "Enter a valid email address." };
  }

  if (password.length < 12) {
    return { error: "Use a password with at least 12 characters." };
  }

  try {
    const [adminCount] = await db
      .select({ total: count() })
      .from(employees)
      .where(and(eq(employees.role, "admin"), eq(employees.active, true)));

    if (adminCount.total > 0) {
      return { error: "An administrator account already exists." };
    }

    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName },
    });

    if (error || !data.user) {
      console.error("Failed to create initial admin Auth user:", error);
      return { error: "Could not create the administrator account." };
    }

    try {
      await db.insert(employees).values({
        authUserId: data.user.id,
        email,
        fullName,
        role: "admin",
        active: true,
      });
    } catch (error) {
      await supabase.auth.admin.deleteUser(data.user.id);
      throw error;
    }

    revalidatePath("/login");
    return { success: "Administrator account created. Sign in to continue." };
  } catch (error) {
    console.error("Failed to create initial administrator:", error);
    return { error: "Could not create the administrator account." };
  }
}

export async function signIn(
  _previousState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const requestedNext = String(formData.get("next") ?? "");
  const next = requestedNext.startsWith("/") &&
    !requestedNext.startsWith("//") &&
    !requestedNext.includes("\\")
    ? requestedNext
    : "/dashboard";

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email or password is incorrect." };
  }

  redirect(next);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}