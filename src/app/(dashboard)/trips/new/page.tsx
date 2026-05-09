import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { NewTripForm } from "@/components/trips/new-trip-form";

export default async function NewTripPage() {
  const session = await getSession();
  const vehicle = await prisma.vehicle.findUnique({
    where: { userId: session!.user.id },
  });

  return (
    <div>
      <TopBar title="Nuevo Viaje" subtitle="Crea un viaje con múltiples destinos" />
      <div className="p-4 lg:p-6 max-w-3xl mx-auto animate-fade-in">
        <NewTripForm vehicle={vehicle} />
      </div>
    </div>
  );
}
