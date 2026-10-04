import { createSupabaseServerClient } from "../../lib/supabase/server";
import { getFirstVehiclePhotoPaths } from "../../db/queries/vehicles";

export async function getVehicleThumbnailUrls(vehicleIds: number[]) {
  const firstPhotos = await getFirstVehiclePhotoPaths(vehicleIds);
  const urls = new Map<number, string>();

  if (firstPhotos.length === 0) {
    return urls;
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from("inventory-photos")
    .createSignedUrls(
      firstPhotos.map((photo) => photo.storagePath),
      60 * 60
    );

  if (error || !data) {
    console.error("Failed to create vehicle thumbnail URLs:", error);
    return urls;
  }

  data.forEach((signedPhoto, index) => {
    if (signedPhoto.signedUrl) {
      urls.set(firstPhotos[index].vehicleId, signedPhoto.signedUrl);
    }
  });

  return urls;
}

export async function getVehiclePhotoUrl(storagePath: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.storage
    .from("inventory-photos")
    .createSignedUrl(storagePath, 60 * 60);

  if (error) {
    console.error("Failed to create signed photo URL:", error);
    return null;
  }

  return data.signedUrl;
}