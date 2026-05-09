import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { calculateRouteSegment } from "@/lib/maps";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const fromLat = parseFloat(searchParams.get("fromLat") ?? "");
  const fromLng = parseFloat(searchParams.get("fromLng") ?? "");
  const toLat = parseFloat(searchParams.get("toLat") ?? "");
  const toLng = parseFloat(searchParams.get("toLng") ?? "");

  if ([fromLat, fromLng, toLat, toLng].some(isNaN)) {
    return NextResponse.json({ error: "Coordenadas inválidas" }, { status: 400 });
  }

  const result = await calculateRouteSegment(fromLat, fromLng, toLat, toLng);
  if (!result) {
    return NextResponse.json({ error: "No se pudo calcular la ruta" }, { status: 500 });
  }

  return NextResponse.json({
    distanceKm: result.distanceKm,
    durationMinutes: result.durationMinutes,
    tollMXN: result.tollCostMXN,
  });
}
