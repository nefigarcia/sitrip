import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calculateRouteSegment, calculateFuelCost } from "@/lib/maps";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const trips = await prisma.trip.findMany({
    where: { driverId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: { stops: { orderBy: { order: "asc" } }, _count: { select: { bookings: true } } },
  });

  return NextResponse.json(trips);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { tripType, title, description, maxPassengers, stops, fuelPrice, profitMargin, driverDailyRate, extraExpenses, notes, publish } = body;

  if (!title || !stops || stops.length < 2) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { userId: session.user.id } });
  const fuelEfficiency = vehicle?.fuelEfficiency ?? 10;

  const validStops = (stops as any[]).filter((s) => s.city?.trim());
  if (validStops.length < 2) {
    return NextResponse.json({ error: "Se necesitan al menos 2 ciudades válidas" }, { status: 400 });
  }

  let totalDistance = 0;
  let totalTolls = 0;
  const segmentData: { distanceKm: number; tollMXN: number }[] = [];

  for (let i = 0; i < validStops.length - 1; i++) {
    const from = validStops[i];
    const to = validStops[i + 1];
    if (from.lat && from.lng && to.lat && to.lng) {
      const seg = await calculateRouteSegment(from.lat, from.lng, to.lat, to.lng);
      if (seg) {
        segmentData.push({ distanceKm: seg.distanceKm, tollMXN: seg.tollCostMXN ?? 0 });
        totalDistance += seg.distanceKm;
        totalTolls += seg.tollCostMXN ?? 0;
      } else {
        segmentData.push({ distanceKm: 0, tollMXN: 0 });
      }
    } else {
      segmentData.push({ distanceKm: 0, tollMXN: 0 });
    }
  }

  const totalFuel = calculateFuelCost(totalDistance, fuelEfficiency, fuelPrice ?? 23.5);
  const totalExtras = (extraExpenses ?? []).reduce((s: number, e: any) => s + (e.amount ?? 0), 0);
  const subtotal = totalFuel + totalTolls + totalExtras;
  const profitAmt = subtotal * ((profitMargin ?? 20) / 100);
  const total = subtotal + profitAmt;
  const pricePerPassenger = maxPassengers > 0 ? total / maxPassengers : 0;

  const startDate = validStops[0]?.departureDate ? new Date(validStops[0].departureDate) : new Date();
  const endDate = validStops[validStops.length - 1]?.arrivalDate
    ? new Date(validStops[validStops.length - 1].arrivalDate)
    : new Date(startDate.getTime() + 86400000);

  const trip = await prisma.trip.create({
    data: {
      driverId: session.user.id,
      tripType: tripType ?? "EXPRESS",
      title,
      description,
      status: publish ? "PUBLISHED" : "DRAFT",
      isPublic: publish ?? false,
      driverDailyRate: driverDailyRate ?? null,
      startDate,
      endDate,
      totalDistance,
      totalFuel,
      totalTolls,
      totalExtras,
      profitMargin: profitMargin ?? 20,
      pricePerPassenger,
      maxPassengers,
      fuelPrice: fuelPrice ?? 23.5,
      notes,
      stops: {
        create: validStops.map((stop, i) => ({
          order: i,
          name: stop.city,
          address: stop.address ?? "",
          city: stop.city,
          state: stop.state ?? "",
          lat: stop.lat,
          lng: stop.lng,
          arrivalDate: stop.arrivalDate ? new Date(stop.arrivalDate) : null,
          departureDate: stop.departureDate ? new Date(stop.departureDate) : null,
          notes: stop.notes ?? "",
          distanceToNext: segmentData[i]?.distanceKm ?? null,
          tollToNext: segmentData[i]?.tollMXN ?? null,
        })),
      },
      expenses: {
        create: [
          ...(totalFuel > 0 ? [{ type: "FUEL" as const, description: "Gasolina (calculado)", amount: totalFuel, isAutomatic: true }] : []),
          ...(totalTolls > 0 ? [{ type: "TOLL" as const, description: "Casetas (calculado)", amount: totalTolls, isAutomatic: true }] : []),
          ...(extraExpenses ?? []).map((e: any) => ({
            type: e.type,
            description: e.description ?? "",
            amount: e.amount,
            isAutomatic: false,
          })),
        ],
      },
    },
  });

  return NextResponse.json({ id: trip.id }, { status: 201 });
}
