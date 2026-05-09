import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { TripCard } from "@/components/trips/trip-card";
import { Button } from "@/components/ui/button";
import { Car, Plus } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const session = await getSession();
  const trips = await prisma.trip.findMany({
    where: { driverId: session!.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      stops: { orderBy: { order: "asc" } },
      _count: { select: { bookings: true } },
    },
  });

  return (
    <div>
      <TopBar title="Mis Viajes" subtitle={`${trips.length} viaje${trips.length !== 1 ? "s" : ""} en total`} />

      <div className="p-4 lg:p-6 animate-fade-in">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
              <Car className="h-10 w-10 text-blue-300" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Aún no tienes viajes</h2>
            <p className="text-muted-foreground max-w-sm mb-6 text-sm">
              Crea tu primer viaje, agrega las paradas y calcula automáticamente el costo de gasolina y casetas.
            </p>
            <Button asChild>
              <Link href="/trips/new">
                <Plus className="h-4 w-4" />
                Crear primer viaje
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex justify-end mb-4">
              <Button asChild>
                <Link href="/trips/new">
                  <Plus className="h-4 w-4" />
                  Nuevo viaje
                </Link>
              </Button>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {trips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
