"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  createInitialAdmin,
  type InitialAdminFormState,
} from "@/src/app/auth/actions";

const initialState: InitialAdminFormState = {};

export function InitialAdminForm() {
  const [state, action, isPending] = useActionState(
    createInitialAdmin,
    initialState
  );

  if (state.success) {
    return (
      <div className="space-y-4" role="status">
        <p className="text-sm text-green-800">{state.success}</p>
        <Link href="/login?reason=setup-complete" className="text-sm font-medium text-green-800 underline">
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm font-medium">Administrator name</label>
        <input
          id="fullName"
          name="fullName"
          autoComplete="name"
          minLength={2}
          maxLength={100}
          required
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          required
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={12}
          required
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="setupToken" className="text-sm font-medium">One-time setup token</label>
        <input
          id="setupToken"
          name="setupToken"
          type="password"
          autoComplete="off"
          required
          className="h-11 w-full rounded-md border bg-background px-3 text-sm"
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive" role="alert">{state.error}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex h-11 w-full items-center justify-center rounded-md bg-green-700 px-4 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create administrator"}
      </button>
    </form>
  );
}