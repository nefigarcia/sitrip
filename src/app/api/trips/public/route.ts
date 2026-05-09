import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const origin   = searchParams.get("origin") ?? "";
  const originLat = parseFloat(searchParams.get("originLat") ?? "");
  const originLng = parseFloat(searchParams.get("originLng") ?? "");
  const tripType  = searchParams.get("tripType") ?? "";

  const trips = await prisma.trip.findMany({
    where: {
      status:   "PUBLISHED",
      isPublic: true,
      driverId: { not: session.user.id }, // excluir viajes propios
      ...(tripType ? { tripType: tripType as any } : {}),
      ...(origin
        ? {
            stops: {
              some: {
                order: 0,
                city:  { contains: origin },
              },
            },
          }
        : {}),
    },
    include: {
      stops: { orderBy: { order: "asc" } },
      driver: {
        select: {
          name:    true,
          avatar:  true,
          phone:   true,
          vehicle: { select: { brand: true, model: true, year: true, capacity: true, fuelType: true } },
        },
      },
      _count: { select: { bookings: true } },
    },
    orderBy: { startDate: "asc" },
    take: 40,
  });

  // Si hay coordenadas, ordenar por proximidad al origen buscado
  if (!isNaN(originLat) && !isNaN(originLng)) {
    trips.sort((a, b) => {
      const stopA = a.stops[0];
      const stopB = b.stops[0];
      if (!stopA?.lat || !stopB?.lat) return 0;
      const distA = Math.pow(stopA.lat - originLat, 2) + Math.pow((stopA.lng ?? 0) - originLng, 2);
      const distB = Math.pow(stopB.lat - originLat, 2) + Math.pow((stopB.lng ?? 0) - originLng, 2);
      return distA - distB;
    });
  }

  return NextResponse.json(trips);
}
