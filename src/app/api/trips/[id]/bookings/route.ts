import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id: params.id } });
  if (!trip) return NextResponse.json({ error: "Viaje no encontrado" }, { status: 404 });
  if (trip.driverId === session.user.id) {
    return NextResponse.json({ error: "No puedes reservar tu propio viaje" }, { status: 400 });
  }
  if (trip.status !== "PUBLISHED") {
    return NextResponse.json({ error: "Este viaje no está disponible" }, { status: 400 });
  }
  if (trip.currentPassengers >= trip.maxPassengers) {
    return NextResponse.json({ error: "No hay lugares disponibles" }, { status: 400 });
  }

  const existing = await prisma.booking.findFirst({
    where: { tripId: params.id, passengerId: session.user.id, status: { in: ["PENDING", "CONFIRMED"] } },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya tienes una reserva en este viaje" }, { status: 400 });
  }

  const body = await req.json();
  const { passengers = 1, notes, contactPhone } = body;
  const totalAmount = trip.pricePerPassenger ? trip.pricePerPassenger * passengers : null;

  const booking = await prisma.booking.create({
    data: {
      tripId: params.id,
      passengerId: session.user.id,
      passengers,
      notes,
      contactPhone,
      totalAmount,
    },
  });

  return NextResponse.json(booking, { status: 201 });
}
