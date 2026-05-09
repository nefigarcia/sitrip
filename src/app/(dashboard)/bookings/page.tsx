import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarCheck, MapPin, Users, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatDate, bookingStatusLabel, getInitials } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusColors: Record<string, any> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

export default async function BookingsPage() {
  const session = await getSession();
  const userId = session!.user.id;

  const [asPassenger, asDriver] = await Promise.all([
    prisma.booking.findMany({
      where: { passengerId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        trip: {
          include: {
            stops: { orderBy: { order: "asc" } },
            driver: { select: { name: true, avatar: true, phone: true } },
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: { trip: { driverId: userId } },
      orderBy: { createdAt: "desc" },
      include: {
        trip: { include: { stops: { orderBy: { order: "asc" } } } },
        passenger: { select: { name: true, avatar: true, email: true, phone: true } },
      },
    }),
  ]);

  function BookingCard({ booking, mode }: { booking: any; mode: "passenger" | "driver" }) {
    const trip = booking.trip;
    const stops = trip.stops ?? [];
    const origin = stops[0]?.city ?? "—";
    const destination = stops[stops.length - 1]?.city ?? "—";

    return (
      <Link href={`/trips/${trip.id}`}>
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <Badge variant={statusColors[booking.status] ?? "secondary"}>
                {bookingStatusLabel(booking.status)}
              </Badge>
              <span className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</span>
            </div>

            <h3 className="font-semibold text-sm mb-2 line-clamp-1">{trip.title}</h3>

            <div className="flex items-center gap-1.5 text-xs mb-3">
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate">{origin}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{destination}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={mode === "passenger" ? (trip.driver?.avatar ?? "") : (booking.passenger?.avatar ?? "")} />
                  <AvatarFallback className="text-xs">
                    {getInitials(mode === "passenger" ? trip.driver?.name : booking.passenger?.name)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">
                  {mode === "passenger" ? trip.driver?.name : booking.passenger?.name}
                </span>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Users className="h-3 w-3" />
                  {booking.passengers} pax
                </div>
                {booking.totalAmount && (
                  <p className="text-xs font-semibold text-emerald-600">{formatCurrency(booking.totalAmount)}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <div>
      <TopBar title="Reservas" subtitle="Historial de todas tus reservas" />

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
                <p className="text-sm text-muted-foreground">
                  Busca viajes publicados y reserva tu lugar.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {asPassenger.map((b) => <BookingCard key={b.id} booking={b} mode="passenger" />)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="driver">
            {asDriver.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <CalendarCheck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h2 className="text-lg font-semibold mb-1">Sin reservas como conductor</h2>
                <p className="text-sm text-muted-foreground">
                  Publica viajes para que los pasajeros puedan reservar.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {asDriver.map((b) => <BookingCard key={b.id} booking={b} mode="driver" />)}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
