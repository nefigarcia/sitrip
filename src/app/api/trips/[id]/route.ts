import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — detalle de un viaje
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      stops:    { orderBy: { order: "asc" } },
      expenses: true,
      bookings: { include: { passenger: { select: { name: true, email: true, phone: true } } } },
      driver:   { select: { name: true, email: true, phone: true } },
    },
  });

  if (!trip) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(trip);
}

// PATCH — editar campos básicos de un viaje propio
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id: params.id } });
  if (!trip || trip.driverId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const allowed = ["title", "description", "maxPassengers", "notes", "fuelPrice", "profitMargin", "isPublic", "status"];
  const data = Object.fromEntries(Object.entries(body).filter(([k]) => allowed.includes(k)));

  const updated = await prisma.trip.update({ where: { id: params.id }, data });
  return NextResponse.json(updated);
}

// DELETE — eliminar o cancelar un viaje propio
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: { bookings: true },
  });

  if (!trip || trip.driverId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  if (trip.status === "COMPLETED") {
    return NextResponse.json(
      { error: "No se pueden eliminar viajes completados" },
      { status: 400 }
    );
  }

  const activeBookings = trip.bookings.filter((b) =>
    ["PENDING", "CONFIRMED"].includes(b.status)
  );

  // Cancelar reservas activas antes de eliminar
  if (activeBookings.length > 0) {
    await prisma.booking.updateMany({
      where: { tripId: params.id, status: { in: ["PENDING", "CONFIRMED"] } },
      data:  { status: "CANCELLED" },
    });
  }

  // Borrador sin historial → eliminar permanentemente
  if (trip.status === "DRAFT" && trip.bookings.length === 0) {
    await prisma.trip.delete({ where: { id: params.id } });
    return NextResponse.json({ deleted: true });
  }

  // Con historial → cancelar (conservar registro)
  await prisma.trip.update({
    where: { id: params.id },
    data:  { status: "CANCELLED", isPublic: false },
  });

  return NextResponse.json({
    cancelled:        true,
    bookingsCancelled: activeBookings.length,
  });
}
