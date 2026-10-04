import Link from "next/link";
import { redirect } from "next/navigation";
import { Recycle } from "lucide-react";

import { InitialAdminForm } from "@/components/auth/initial-admin-form";
import { hasActiveAdmin } from "@/src/db/queries/settings";

export const dynamic = "force-dynamic";

export default async function InitialAdminSetupPage() {
  if (
    process.env.INITIAL_ADMIN_SETUP_ENABLED !== "true" ||
    !process.env.INITIAL_ADMIN_SETUP_TOKEN ||
    process.env.INITIAL_ADMIN_USER_ID ||
    await hasActiveAdmin()
  ) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-5 py-12">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-md bg-green-700 text-white">
            <Recycle className="size-6" />
          </div>
          <div>
            <p className="font-semibold">CarRecycler</p>
            <p className="text-sm text-muted-foreground">First-run setup</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold">Create the first admin</h1>
        <p className="mb-7 mt-2 text-sm text-muted-foreground">
          This setup is available only before an active administrator exists.
        </p>

        <InitialAdminForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link href="/login" className="hover:text-foreground">Back to sign in</Link>
        </p>
      </div>
    </main>
  );
}