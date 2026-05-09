import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: { trip: true },
  });
  if (!booking) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const isDriver = booking.trip.driverId === session.user.id;
  const isPassenger = booking.passengerId === session.user.id;
  if (!isDriver && !isPassenger) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { status } = await req.json();
  const validStatuses = isDriver
    ? ["CONFIRMED", "CANCELLED", "COMPLETED"]
    : ["CANCELLED"];

  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Acción no permitida" }, { status: 400 });
  }

  const updated = await prisma.booking.update({ where: { id: params.id }, data: { status } });

  if (status === "CONFIRMED") {
    await prisma.trip.update({
      where: { id: booking.tripId },
      data: { currentPassengers: { increment: booking.passengers } },
    });
  }
  if (status === "CANCELLED" && booking.status === "CONFIRMED") {
    await prisma.trip.update({
      where: { id: booking.tripId },
      data: { currentPassengers: { decrement: booking.passengers } },
    });
  }

  return NextResponse.json(updated);
}
