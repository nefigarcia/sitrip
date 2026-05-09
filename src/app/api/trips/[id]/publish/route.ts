import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const trip = await prisma.trip.findUnique({ where: { id: params.id } });
  if (!trip || trip.driverId !== session.user.id) {
    return NextResponse.json({ error: "No encontrado o sin permisos" }, { status: 403 });
  }

  const body = await req.json();
  const { status, isPublic } = body;

  const updated = await prisma.trip.update({
    where: { id: params.id },
    data: {
      ...(status !== undefined && { status }),
      ...(isPublic !== undefined && { isPublic }),
    },
  });

  return NextResponse.json(updated);
}
