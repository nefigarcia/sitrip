import Link from "next/link";
import { MapPin, Calendar, Users, ArrowRight, Fuel } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatShortDate, tripStatusLabel } from "@/lib/utils";

const statusColors: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  DRAFT: "secondary",
  PUBLISHED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",
};

interface TripCardProps {
  trip: {
    id: string;
    title: string;
    status: string;
    startDate: Date;
    endDate: Date;
    maxPassengers: number;
    currentPassengers: number;
    pricePerPassenger: number | null;
    isPublic: boolean;
    stops: { city: string; order: number }[];
    _count: { bookings: number };
  };
}

export function TripCard({ trip }: TripCardProps) {
  const stops = [...trip.stops].sort((a, b) => a.order - b.order);
  const origin = stops[0]?.city ?? "—";
  const destination = stops[stops.length - 1]?.city ?? "—";
  const intermediate = stops.slice(1, -1);

  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <Badge variant={statusColors[trip.status] ?? "secondary"}>
              {tripStatusLabel(trip.status)}
            </Badge>
            {trip.isPublic && (
              <Badge variant="outline" className="text-xs">Público</Badge>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 leading-snug">{trip.title}</h3>

          {/* Route visual */}
          <div className="flex items-center gap-1.5 mb-3 text-sm">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="font-medium truncate text-xs">{origin}</span>
            </div>
            {intermediate.length > 0 && (
              <>
                <span className="text-muted-foreground text-xs shrink-0">+{intermediate.length}</span>
              </>
            )}
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="font-medium truncate text-xs">{destination}</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Fecha</span>
              <span className="text-xs font-medium">{formatShortDate(trip.startDate)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Pasajeros</span>
              <span className="text-xs font-medium">
                {trip.currentPassengers}/{trip.maxPassengers}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Por pax</span>
              <span className="text-xs font-medium text-emerald-600">
                {trip.pricePerPassenger ? formatCurrency(trip.pricePerPassenger) : "—"}
              </span>
            </div>
          </div>

          {trip._count.bookings > 0 && (
            <div className="mt-3 pt-3 border-t flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {trip._count.bookings} reserva{trip._count.bookings !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
