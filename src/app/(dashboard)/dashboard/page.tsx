import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Car, CalendarCheck, MapPin, TrendingUp,
  Plus, ArrowRight, Clock, CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatShortDate, tripStatusLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session!.user.id;
  const role = session!.user.role ?? "BOTH";

  const isDriver    = role === "DRIVER" || role === "BOTH";
  const isPassenger = role === "PASSENGER" || role === "BOTH";

  const [trips, bookings, requests, vehicle] = await Promise.all([
    isDriver
      ? prisma.trip.findMany({
          where: { driverId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { _count: { select: { bookings: true } } },
        })
      : Promise.resolve([]),
    isPassenger
      ? prisma.booking.findMany({
          where: { passengerId: userId },
          orderBy: { createdAt: "desc" },
          take: 5,
          include: { trip: { select: { title: true, startDate: true } } },
        })
      : Promise.resolve([]),
    prisma.tripRequest.findMany({
      where: { status: "OPEN", ...(isPassenger ? {} : { passengerId: { not: userId } }) },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    isDriver
      ? prisma.vehicle.findUnique({ where: { userId } })
      : Promise.resolve(null),
  ]);

  const totalEarnings = (trips as any[])
    .filter((t) => t.status === "COMPLETED")
    .reduce((sum, t) => sum + (t.pricePerPassenger ?? 0) * t.currentPassengers, 0);

  const activeTrips = (trips as any[]).filter((t) =>
    ["PUBLISHED", "IN_PROGRESS"].includes(t.status)
  ).length;

  const pendingBookings = (bookings as any[]).filter((b) => b.status === "PENDING").length;

  const statusColors: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
    DRAFT: "secondary",
    PUBLISHED: "info",
    IN_PROGRESS: "warning",
    COMPLETED: "success",
    CANCELLED: "destructive",
    PENDING: "warning",
    CONFIRMED: "success",
  };

  return (
    <div>
      <TopBar
        title={`¡Hola, ${session!.user.name?.split(" ")[0]}! 👋`}
        subtitle="Aquí está el resumen de tu actividad"
      />

      <div className="p-4 lg:p-6 space-y-6 animate-fade-in">

        {/* Alerta de vehículo — solo para conductores */}
        {isDriver && !vehicle && (
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <span className="text-amber-500 text-xl">⚠️</span>
            <div className="flex-1">
              <p className="font-medium text-amber-800 text-sm">Agrega tu vehículo para calcular gastos</p>
              <p className="text-amber-600 text-xs mt-0.5">
                Sin rendimiento de gasolina, no podemos calcular los costos automáticamente.
              </p>
            </div>
            <Button size="sm" asChild className="bg-amber-600 hover:bg-amber-700 shrink-0">
              <Link href="/profile">Agregar</Link>
            </Button>
          </div>
        )}

        {/* Stats — condicionales por rol */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isDriver && (
            <Link href="/trips">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 mb-3">
                    <Car className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{activeTrips}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Viajes activos</div>
                </CardContent>
              </Card>
            </Link>
          )}

          {isDriver && (
            <Link href="/trips">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 mb-3">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900">{formatCurrency(totalEarnings)}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Ganancias totales</div>
                </CardContent>
              </Card>
            </Link>
          )}

          <Link href="/bookings">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 mb-3">
                  <CalendarCheck className="h-5 w-5 text-amber-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{pendingBookings}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Reservas pendientes</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/requests">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 mb-3">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{requests.length}</div>
                <div className="text-xs text-muted-foreground mt-0.5">Solicitudes abiertas</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mis viajes — solo conductores */}
          {isDriver && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Mis viajes recientes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/trips" className="gap-1 text-xs">
                    Ver todos <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {(trips as any[]).length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Aún no tienes viajes</p>
                    <Button size="sm" asChild className="mt-3">
                      <Link href="/trips/new">
                        <Plus className="h-4 w-4" /> Crear primer viaje
                      </Link>
                    </Button>
                  </div>
                ) : (
                  (trips as any[]).map((trip) => (
                    <Link
                      key={trip.id}
                      href={`/trips/${trip.id}`}
                      className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{trip.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatShortDate(trip.startDate)}
                          </span>
                          <span className="text-xs text-muted-foreground">·</span>
                          <span className="text-xs text-muted-foreground">
                            {trip._count.bookings} reserva{trip._count.bookings !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusColors[trip.status] ?? "secondary"}>
                        {tripStatusLabel(trip.status)}
                      </Badge>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Mis reservas — solo pasajeros */}
          {isPassenger && !isDriver && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <CardTitle className="text-base">Mis reservas recientes</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/bookings" className="gap-1 text-xs">
                    Ver todas <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {(bookings as any[]).length === 0 ? (
                  <div className="text-center py-8">
                    <CalendarCheck className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Aún no tienes reservas</p>
                    <Button size="sm" asChild className="mt-3">
                      <Link href="/requests/new">
                        <Plus className="h-4 w-4" /> Publicar solicitud
                      </Link>
                    </Button>
                  </div>
                ) : (
                  (bookings as any[]).map((booking) => (
                    <Link
                      key={booking.id}
                      href={`/trips/${booking.trip?.id ?? ""}`}
                      className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{booking.trip?.title}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {booking.trip?.startDate ? formatShortDate(booking.trip.startDate) : ""}
                          </span>
                        </div>
                      </div>
                      <Badge variant={statusColors[booking.status] ?? "secondary"}>
                        {booking.status === "PENDING" ? "Pendiente"
                          : booking.status === "CONFIRMED" ? "Confirmada"
                          : booking.status === "CANCELLED" ? "Cancelada"
                          : "Completada"}
                      </Badge>
                    </Link>
                  ))
                )}
              </CardContent>
            </Card>
          )}

          {/* Solicitudes de pasajeros */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">
                {isDriver ? "Solicitudes de pasajeros" : "Solicitudes abiertas"}
              </CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/requests" className="gap-1 text-xs">
                  Ver todas <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              {requests.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No hay solicitudes abiertas</p>
                  {isPassenger && (
                    <Button size="sm" asChild className="mt-3">
                      <Link href="/requests/new">
                        <Plus className="h-4 w-4" /> Publicar solicitud
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                requests.map((req) => (
                  <Link
                    key={req.id}
                    href={`/requests/${req.id}`}
                    className="flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                      <MapPin className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{req.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {req.origin} → {req.destination}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-medium">{formatShortDate(req.startDate)}</p>
                      <p className="text-xs text-muted-foreground">{req.passengers} pax</p>
                    </div>
                  </Link>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Acciones rápidas — condicionales por rol */}
        <Card>
          <CardContent className="p-4">
            <p className="text-sm font-medium mb-3 text-muted-foreground">Acciones rápidas</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {isDriver && (
                <Link
                  href="/trips/new"
                  className="flex flex-col items-center gap-2 rounded-xl p-4 border hover:shadow-sm hover:border-primary/30 transition-all text-center"
                >
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-50 text-blue-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">Nuevo viaje</span>
                </Link>
              )}
              {isPassenger && (
                <Link
                  href="/requests/new"
                  className="flex flex-col items-center gap-2 rounded-xl p-4 border hover:shadow-sm hover:border-primary/30 transition-all text-center"
                >
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">Pedir viaje</span>
                </Link>
              )}
              <Link
                href="/requests"
                className="flex flex-col items-center gap-2 rounded-xl p-4 border hover:shadow-sm hover:border-primary/30 transition-all text-center"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-purple-50 text-purple-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Ver solicitudes</span>
              </Link>
              <Link
                href="/bookings"
                className="flex flex-col items-center gap-2 rounded-xl p-4 border hover:shadow-sm hover:border-primary/30 transition-all text-center"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-emerald-50 text-emerald-600">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Mis reservas</span>
              </Link>
              <Link
                href="/profile"
                className="flex flex-col items-center gap-2 rounded-xl p-4 border hover:shadow-sm hover:border-primary/30 transition-all text-center"
              >
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-amber-50 text-amber-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium">Mi perfil</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
