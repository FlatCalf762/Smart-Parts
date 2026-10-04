"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, UserRoundX } from "lucide-react";

import {
  inviteEmployee,
  removeEmployee,
  saveInventoryDefaults,
  updateEmployeeRole,
  updateOwnPassword,
} from "@/src/app/settings/actions";

interface EmployeeRecord {
  authUserId: string;
  email: string;
  fullName: string;
  role: "admin" | "employee";
  active: boolean;
}

interface SettingsPanelProps {
  currentEmployeeId: string;
  isAdmin: boolean;
  employees: EmployeeRecord[];
  vehicleConditions: string[];
  yardLocations: string[];
}

type Feedback = { error?: string; message?: string };

export function SettingsPanel({
  currentEmployeeId,
  isAdmin,
  employees,
  vehicleConditions,
  yardLocations,
}: SettingsPanelProps) {
  const router = useRouter();
  const activeAdminCount = employees.filter(
    (employee) => employee.active && employee.role === "admin"
  ).length;
  const [feedback, setFeedback] = useState<Feedback>({});
  const [isBusy, setIsBusy] = useState(false);

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsBusy(true);
    setFeedback({});

    try {
      const result = await inviteEmployee({
        email: String(formData.get("email") ?? ""),
        fullName: String(formData.get("fullName") ?? ""),
      });
      setFeedback(result);
      if (result.success) {
        form.reset();
        router.refresh();
      }
    } catch {
      setFeedback({ error: "Could not send the employee invitation." });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRoleChange(
    authUserId: string,
    previousRole: "admin" | "employee",
    nextRole: "admin" | "employee",
    select: HTMLSelectElement
  ) {
    setIsBusy(true);
    setFeedback({});

    try {
      const result = await updateEmployeeRole(authUserId, nextRole);
      setFeedback(result);
      if (result.success) {
        router.refresh();
      } else {
        select.value = previousRole;
      }
    } catch {
      select.value = previousRole;
      setFeedback({ error: "Could not update the employee role." });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleRemove(employee: EmployeeRecord) {
    if (
      !window.confirm(
        `Remove ${employee.fullName} and revoke their sign-in access?`
      )
    ) {
      return;
    }

    setIsBusy(true);
    setFeedback({});

    try {
      const result = await removeEmployee(employee.authUserId);
      setFeedback(result);
      if (result.success) {
        router.refresh();
      }
    } catch {
      setFeedback({ error: "Could not remove the employee account." });
    } finally {
      setIsBusy(false);
    }
  }

  async function handleInventoryDefaults(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setIsBusy(true);
    setFeedback({});

    try {
      const result = await saveInventoryDefaults({
        vehicleConditions: String(formData.get("vehicleConditions") ?? "").split(/\r?\n/),
        yardLocations: String(formData.get("yardLocations") ?? "").split(/\r?\n/),
      });
      setFeedback(result);
      if (result.success) {
        router.refresh();
      }
    } catch {
      setFeedback({ error: "Could not save inventory defaults." });
    } finally {
      setIsBusy(false);
    }
  }

  async function handlePasswordChange(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setIsBusy(true);
    setFeedback({});

    try {
      const result = await updateOwnPassword({
        password: String(formData.get("password") ?? ""),
        confirmPassword: String(formData.get("confirmPassword") ?? ""),
      });
      setFeedback(result);
      if (result.success) {
        form.reset();
      }
    } catch {
      setFeedback({ error: "Could not update your password." });
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="divide-y rounded-md border bg-background">
      {feedback.message && (
        <p className="px-5 py-3 text-sm text-green-700" role="status">
          {feedback.message}
        </p>
      )}
      {feedback.error && (
        <p className="px-5 py-3 text-sm text-destructive" role="alert">
          {feedback.error}
        </p>
      )}

      {isAdmin && (
        <section className="space-y-5 p-5" aria-labelledby="employees-heading">
          <div>
            <h2 id="employees-heading" className="text-lg font-semibold">
              Employees and roles
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Invite staff and control administrator access.
            </p>
          </div>

          <form onSubmit={handleInvite} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              name="fullName"
              required
              minLength={2}
              maxLength={100}
              placeholder="Employee name"
              aria-label="Employee name"
              className="h-10 rounded-md border bg-background px-3 text-sm"
            />
            <input
              name="email"
              type="email"
              required
              placeholder="Work email"
              aria-label="Work email"
              className="h-10 rounded-md border bg-background px-3 text-sm"
            />
            <button
              type="submit"
              disabled={isBusy}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <UserPlus className="size-4" />
              Invite
            </button>
          </form>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[36rem] text-left text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="py-3 pr-4 font-medium">Employee</th>
                  <th className="py-3 pr-4 font-medium">Role</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 text-right font-medium">Access</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {employees.map((employee) => (
                  <tr key={employee.authUserId}>
                    <td className="py-3 pr-4">
                      <p className="font-medium">{employee.fullName}</p>
                      <p className="text-xs text-muted-foreground">{employee.email}</p>
                    </td>
                    <td className="py-3 pr-4">
                      <select
                        aria-label={`Role for ${employee.fullName}`}
                        defaultValue={employee.role}
                        disabled={isBusy || employee.authUserId === currentEmployeeId}
                        onChange={(event) =>
                          handleRoleChange(
                            employee.authUserId,
                            employee.role,
                            event.currentTarget.value as "admin" | "employee",
                            event.currentTarget
                          )
                        }
                        className="h-9 rounded-md border bg-background px-2"
                      >
                        <option value="employee">Employee</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-3 pr-4">
                      {employee.active ? "Active" : "Inactive"}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleRemove(employee)}
                        disabled={
                          isBusy ||
                          employee.authUserId === currentEmployeeId ||
                          (employee.active &&
                            employee.role === "admin" &&
                            activeAdminCount <= 1)
                        }
                        aria-label={`Remove ${employee.fullName}`}
                        title="Remove employee"
                        className="inline-flex size-9 items-center justify-center rounded-md text-destructive hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <UserRoundX className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {isAdmin && (
        <section className="space-y-5 p-5" aria-labelledby="inventory-settings-heading">
          <div>
            <h2 id="inventory-settings-heading" className="text-lg font-semibold">
              Inventory defaults
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              These options appear in vehicle create and edit forms.
            </p>
          </div>

          <form onSubmit={handleInventoryDefaults} className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium">
              Vehicle conditions
              <textarea
                name="vehicleConditions"
                required
                defaultValue={vehicleConditions.join("\n")}
                rows={6}
                className="block w-full rounded-md border bg-background px-3 py-2 text-sm font-normal"
                aria-describedby="conditions-help"
              />
              <span id="conditions-help" className="block text-xs font-normal text-muted-foreground">
                One option per line.
              </span>
            </label>
            <label className="space-y-2 text-sm font-medium">
              Yard locations
              <textarea
                name="yardLocations"
                defaultValue={yardLocations.join("\n")}
                rows={6}
                className="block w-full rounded-md border bg-background px-3 py-2 text-sm font-normal"
                aria-describedby="locations-help"
              />
              <span id="locations-help" className="block text-xs font-normal text-muted-foreground">
                One option per line. Leave blank to allow free entry only.
              </span>
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isBusy}
                className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              >
                Save inventory defaults
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="space-y-5 p-5" aria-labelledby="security-heading">
        <div>
          <h2 id="security-heading" className="text-lg font-semibold">
            Account security
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Change your sign-in password.
          </p>
        </div>

        <form onSubmit={handlePasswordChange} className="grid gap-3 sm:grid-cols-2">
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={10}
            required
            placeholder="New password"
            aria-label="New password"
            className="h-10 rounded-md border bg-background px-3 text-sm"
          />
          <input
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            minLength={10}
            required
            placeholder="Confirm new password"
            aria-label="Confirm new password"
            className="h-10 rounded-md border bg-background px-3 text-sm"
          />
          <p className="text-xs text-muted-foreground sm:col-span-2">
            Use at least 10 characters.
          </p>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={isBusy}
              className="h-10 rounded-md border px-4 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Update password
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}