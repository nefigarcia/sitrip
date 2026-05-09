import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { TripDetail } from "@/components/trips/trip-detail";

export const dynamic = "force-dynamic";

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();

  const trip = await prisma.trip.findUnique({
    where: { id: params.id },
    include: {
      driver: { select: { name: true, email: true, phone: true, avatar: true } },
      stops: { orderBy: { order: "asc" } },
      expenses: true,
      bookings: {
        include: {
          passenger: { select: { name: true, email: true, phone: true, avatar: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!trip) notFound();

  const isOwner = trip.driverId === session!.user.id;

  return (
    <div>
      <TopBar title={trip.title} subtitle={isOwner ? "Tu viaje" : `Conductor: ${trip.driver.name}`} />
      <div className="p-4 lg:p-6 max-w-4xl mx-auto animate-fade-in">
        <TripDetail trip={trip as any} isOwner={isOwner} userId={session!.user.id} />
      </div>
    </div>
  );
}
