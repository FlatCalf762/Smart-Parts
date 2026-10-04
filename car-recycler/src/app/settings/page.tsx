import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { SettingsPanel } from "@/components/settings/settings-panel";
import { getEmployees, getInventoryDefaults } from "@/src/db/queries/settings";
import { requireEmployee } from "@/src/lib/auth/employee";

interface SettingsPageProps {
  searchParams: Promise<{ setup?: string }>;
}

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const employee = await requireEmployee();
  const { setup } = await searchParams;
  const isAdmin = employee.role === "admin";

  const [employees, inventoryDefaults] = isAdmin
    ? await Promise.all([getEmployees(), getInventoryDefaults()])
    : [[], { vehicleConditions: [], yardLocations: [] }];

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-5xl space-y-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin
                  ? "Manage team access, inventory options, and your account."
                  : "Manage your account security."}
              </p>
            </div>
            {setup === "password" && (
              <p className="border-l-4 border-green-700 bg-green-50 px-4 py-3 text-sm text-green-900" role="status">
                Set a password for your employee account before your next sign-in.
              </p>
            )}
            <SettingsPanel
              currentEmployeeId={employee.authUserId}
              isAdmin={isAdmin}
              employees={employees}
              vehicleConditions={inventoryDefaults.vehicleConditions}
              yardLocations={inventoryDefaults.yardLocations}
            />
          </div>
        </main>
      </div>
    </div>
  );
}