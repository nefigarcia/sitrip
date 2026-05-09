import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { brand, model, year, color, licensePlate, fuelEfficiency, fuelType, capacity } = body;

  const existing = await prisma.vehicle.findUnique({ where: { userId: session.user.id } });
  if (existing) {
    return NextResponse.json({ error: "Ya tienes un vehículo registrado, usa PATCH" }, { status: 400 });
  }

  const vehicle = await prisma.vehicle.create({
    data: {
      userId: session.user.id,
      brand, model, year, color, licensePlate,
      fuelEfficiency, fuelType, capacity,
    },
  });

  return NextResponse.json(vehicle, { status: 201 });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json();
  const { brand, model, year, color, licensePlate, fuelEfficiency, fuelType, capacity } = body;

  const vehicle = await prisma.vehicle.upsert({
    where: { userId: session.user.id },
    update: { brand, model, year, color, licensePlate, fuelEfficiency, fuelType, capacity },
    create: {
      userId: session.user.id,
      brand, model, year, color, licensePlate,
      fuelEfficiency, fuelType, capacity,
    },
  });

  return NextResponse.json(vehicle);
}
