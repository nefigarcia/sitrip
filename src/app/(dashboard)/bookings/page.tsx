import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarCheck } from "lucide-react";
import { BookingsList } from "@/components/bookings/bookings-list";

export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  const session = await getSession();
  const userId  = session!.user.id;

  const [asPassenger, asDriver] = await Promise.all([
    prisma.booking.findMany({
      where: { passengerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        trip: {
          include: {
            stops:  { orderBy: { order: "asc" } },
            driver: { select: { name: true, avatar: true, phone: true } },
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: { trip: { driverId: userId } },
      orderBy: { createdAt: "desc" },
      include: {
        trip:      { include: { stops: { orderBy: { order: "asc" } } } },
        passenger: { select: { name: true, avatar: true, email: true, phone: true } },
      },
    }),
  ]);

  return (
    <div>
      <TopBar title="Reservas" subtitle="Historial y gestión de tus reservas" />

      <div className="p-4 lg:p-6 animate-fade-in">
        <Tabs defaultValue="passenger">
          <TabsList className="mb-4">
            <TabsTrigger value="passenger">Como pasajero ({asPassenger.length})</TabsTrigger>
            <TabsTrigger value="driver">Como conductor ({asDriver.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="passenger">
            {asPassenger.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h2 className="text-lg font-semibold mb-1">Sin reservas como pasajero</h2>
                <p className="text-sm text-muted-foreground">Busca viajes disponibles y reserva tu lugar.</p>
              </div>
            ) : (
              <BookingsList bookings={asPassenger as any} mode="passenger" />
            )}
          </TabsContent>

          <TabsContent value="driver">
            {asDriver.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h2 className="text-lg font-semibold mb-1">Sin reservas como conductor</h2>
                <p className="text-sm text-muted-foreground">Publica viajes para que los pasajeros puedan reservar.</p>
              </div>
            ) : (
              <BookingsList bookings={asDriver as any} mode="driver" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
