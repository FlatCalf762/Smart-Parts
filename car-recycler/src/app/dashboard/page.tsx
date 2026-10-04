import Link from "next/link";
import { Car, Package, Warehouse, TrendingUp, Clock, CheckCircle } from "lucide-react";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { RecentVehicles } from "@/components/dashboard/recent-vehicles";
import { getVehicleStats } from "@/src/db/queries/vehicles";

export default async function DashboardPage() {
  const stats = await getVehicleStats();

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header />

        <main className="flex-1 p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            {/* Page heading */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  Dashboard
                </h1>

                <p className="text-muted-foreground">
                  Manage your vehicle and parts inventory.
                </p>
              </div>

              <Link
                href="/vehicles/new"
                className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-4 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <Car className="mr-2 h-4 w-4" />
                Add Vehicle
              </Link>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatsCard
                title="Total Vehicles"
                value={stats.total}
                description="Vehicles in inventory"
                icon={<Car className="h-5 w-5" />}
              />

              <StatsCard
                title="Available"
                value={stats.available}
                description="Vehicles in good condition"
                icon={<CheckCircle className="h-5 w-5" />}
              />

              <StatsCard
                title="Pending"
                value={stats.pending}
                description="Vehicles awaiting processing"
                icon={<Clock className="h-5 w-5" />}
              />
            </div>

            {/* Recent vehicles */}
            <RecentVehicles />
          </div>
        </main>
      </div>
    </div>
  );
}