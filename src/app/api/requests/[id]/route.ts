import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET — detalle de una solicitud
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const request = await prisma.tripRequest.findUnique({
    where: { id: params.id },
    include: {
      passenger: { select: { name: true, email: true, phone: true } },
      offers:    { include: { driver: { select: { name: true, email: true, phone: true, vehicle: true } } } },
    },
  });

  if (!request) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(request);
}

// PATCH — cancelar una solicitud propia
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const request = await prisma.tripRequest.findUnique({ where: { id: params.id } });
  if (!request || request.passengerId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }
  if (request.status !== "OPEN") {
    return NextResponse.json({ error: "Solo se pueden cancelar solicitudes abiertas" }, { status: 400 });
  }

  // Rechazar ofertas pendientes antes de cancelar
  await prisma.offer.updateMany({
    where: { requestId: params.id, status: "PENDING" },
    data:  { status: "REJECTED" },
  });

  const updated = await prisma.tripRequest.update({
    where: { id: params.id },
    data:  { status: "CANCELLED" },
  });

  return NextResponse.json(updated);
}

// DELETE — eliminar solicitud (solo si está cancelada o sin ofertas)
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const request = await prisma.tripRequest.findUnique({
    where: { id: params.id },
    include: { offers: true },
  });

  if (!request || request.passengerId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  if (request.status === "COMPLETED") {
    return NextResponse.json({ error: "No se pueden eliminar solicitudes completadas" }, { status: 400 });
  }

  await prisma.offer.deleteMany({ where: { requestId: params.id } });
  await prisma.tripRequest.delete({ where: { id: params.id } });

  return NextResponse.json({ deleted: true });
}
