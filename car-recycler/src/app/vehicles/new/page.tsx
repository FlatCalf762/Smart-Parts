import { NewVehicleForm } from "@/components/vehicles/new-vehicle-form";
import { getInventoryDefaults } from "@/src/db/queries/settings";
import { requireEmployee } from "@/src/lib/auth/employee";

export default async function NewVehiclePage() {
  await requireEmployee();
  const inventoryDefaults = await getInventoryDefaults();

  return (
    <NewVehicleForm
      conditionOptions={inventoryDefaults.vehicleConditions}
      yardLocations={inventoryDefaults.yardLocations}
    />
  );
}