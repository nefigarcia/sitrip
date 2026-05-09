import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const requests = await prisma.tripRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "desc" },
    include: {
      passenger: { select: { name: true, avatar: true } },
      _count: { select: { offers: true } },
    },
  });

  return NextResponse.json(requests);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const {
    title, tripType, origin, originLat, originLng,
    destination, destLat, destLng, waypoints,
    description, startDate, endDate, totalDays,
    passengers, budget,
  } = body;

  if (!title || !origin || !destination || !startDate) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }

  const request = await prisma.tripRequest.create({
    data: {
      passengerId: session.user.id,
      title,
      tripType: tripType ?? "EXPRESS",
      origin,
      originLat: originLat ?? null,
      originLng: originLng ?? null,
      destination,
      destLat: destLat ?? null,
      destLng: destLng ?? null,
      waypoints: waypoints ?? null,
      description,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      totalDays: totalDays ?? null,
      passengers: passengers ?? 1,
      budget: budget ?? null,
    },
  });

  return NextResponse.json(request, { status: 201 });
}
