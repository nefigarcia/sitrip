import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { name, phone, bio } = await req.json();

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data: { name, phone, bio },
  });

  return NextResponse.json({ success: true });
}
