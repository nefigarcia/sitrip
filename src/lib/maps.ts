export interface RouteSegment {
  distanceMeters: number;
  distanceKm: number;
  durationSeconds: number;
  durationMinutes: number;
  tollCostMXN: number | null;
}

export async function calculateRouteSegment(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteSegment | null> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;

  try {
    const res = await fetch(
      "https://routes.googleapis.com/directions/v2:computeRoutes",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "routes.distanceMeters,routes.duration,routes.travelAdvisory.tollInfo",
        },
        body: JSON.stringify({
          origin: {
            location: { latLng: { latitude: originLat, longitude: originLng } },
          },
          destination: {
            location: { latLng: { latitude: destLat, longitude: destLng } },
          },
          travelMode: "DRIVE",
          extraComputations: ["TOLLS"],
          routeModifiers: {
            vehicleInfo: { emissionType: "GASOLINE" },
          },
        }),
      }
    );

    if (!res.ok) return null;
    const data = await res.json();
    const route = data.routes?.[0];
    if (!route) return null;

    const tollPrices = route.travelAdvisory?.tollInfo?.estimatedPrice;
    const mxnToll = tollPrices?.find((p: any) => p.currencyCode === "MXN");
    const tollCostMXN = mxnToll
      ? parseFloat(mxnToll.units || "0") + (mxnToll.nanos || 0) / 1e9
      : null;

    const distanceMeters = route.distanceMeters ?? 0;
    const durationSeconds = parseInt(
      (route.duration ?? "0s").replace("s", ""),
      10
    );

    return {
      distanceMeters,
      distanceKm: distanceMeters / 1000,
      durationSeconds,
      durationMinutes: Math.round(durationSeconds / 60),
      tollCostMXN,
    };
  } catch {
    return null;
  }
}

export function calculateFuelCost(
  distanceKm: number,
  fuelEfficiencyKmL: number,
  fuelPriceMXN: number
): number {
  if (fuelEfficiencyKmL <= 0) return 0;
  const litersNeeded = distanceKm / fuelEfficiencyKmL;
  return litersNeeded * fuelPriceMXN;
}

export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}
