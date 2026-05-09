import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const request = await prisma.tripRequest.findUnique({ where: { id: params.id } });
  if (!request) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (request.passengerId === session.user.id) {
    return NextResponse.json({ error: "No puedes hacer oferta en tu propia solicitud" }, { status: 400 });
  }
  if (request.status !== "OPEN") {
    return NextResponse.json({ error: "Esta solicitud ya no está disponible" }, { status: 400 });
  }

  const existing = await prisma.offer.findFirst({
    where: { requestId: params.id, driverId: session.user.id },
  });
  if (existing) {
    return NextResponse.json({ error: "Ya enviaste una oferta" }, { status: 400 });
  }

  const { amount, message } = await req.json();
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Monto inválido" }, { status: 400 });
  }

  const offer = await prisma.offer.create({
    data: {
      requestId: params.id,
      driverId: session.user.id,
      amount,
      message,
    },
  });

  return NextResponse.json(offer, { status: 201 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const request = await prisma.tripRequest.findUnique({ where: { id: params.id } });
  if (!request || request.passengerId !== session.user.id) {
    return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
  }

  const { offerId, status } = await req.json();
  if (!["ACCEPTED", "REJECTED"].includes(status)) {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  const offer = await prisma.offer.update({
    where: { id: offerId },
    data: { status },
  });

  if (status === "ACCEPTED") {
    await prisma.tripRequest.update({
      where: { id: params.id },
      data: { status: "ACCEPTED" },
    });
  }

  return NextResponse.json(offer);
}
