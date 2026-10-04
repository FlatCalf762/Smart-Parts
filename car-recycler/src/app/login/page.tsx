import { Recycle } from "lucide-react";

import { LoginForm } from "@/components/auth/login-form";
import { hasActiveAdmin } from "@/src/db/queries/settings";

interface LoginPageProps {
  searchParams: Promise<{
    next?: string;
    reason?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { next, reason } = await searchParams;
  const showSetupLink = Boolean(
    process.env.INITIAL_ADMIN_SETUP_ENABLED === "true" &&
    process.env.INITIAL_ADMIN_SETUP_TOKEN &&
    !process.env.INITIAL_ADMIN_USER_ID &&
    !(await hasActiveAdmin())
  );

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-5 py-12">
      <div className="w-full max-w-md rounded-lg border bg-background p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-md bg-green-700 text-white">
            <Recycle className="size-6" />
          </div>
          <div>
            <p className="font-semibold">CarRecycler</p>
            <p className="text-sm text-muted-foreground">Employee access</p>
          </div>
        </div>

        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 mb-7 text-sm text-muted-foreground">
          Use the work account invited by your administrator.
        </p>

        {reason === "access" && (
          <p className="mb-5 rounded-md bg-amber-50 p-3 text-sm text-amber-900" role="status">
            Your account does not have active employee access. Contact an administrator.
          </p>
        )}

        {reason === "invite" && (
          <p className="mb-5 rounded-md bg-amber-50 p-3 text-sm text-amber-900" role="status">
            That invitation link could not be verified. Ask your administrator to send another.
          </p>
        )}

        {reason === "setup-complete" && (
          <p className="mb-5 rounded-md bg-green-50 p-3 text-sm text-green-900" role="status">
            Administrator account created. Sign in with the account you just set up.
          </p>
        )}

        <LoginForm next={next ?? "/dashboard"} />

        {showSetupLink && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            First time here? <a href="/setup" className="font-medium text-green-800 hover:underline">Create the first admin</a>
          </p>
        )}
      </div>
    </main>
  );
}