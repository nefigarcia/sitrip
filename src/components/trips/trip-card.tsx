"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Users, ArrowRight, MoreVertical, Trash2, Globe, GlobeLock, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
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
    tripType?: string;
    startDate: Date;
    endDate: Date;
    maxPassengers: number;
    currentPassengers: number;
    pricePerPassenger: number | null;
    isPublic: boolean;
    stops: { city: string; order: number }[];
    _count: { bookings: number };
  };
  isOwner?: boolean;
}

export function TripCard({ trip, isOwner = false }: TripCardProps) {
  const router = useRouter();
  const stops       = [...trip.stops].sort((a, b) => a.order - b.order);
  const origin      = stops[0]?.city ?? "—";
  const destination = stops[stops.length - 1]?.city ?? "—";
  const intermediate = stops.slice(1, -1);

  const [confirmOpen, setConfirmOpen]  = useState(false);
  const [deleting, setDeleting]        = useState(false);
  const [togglingPub, setTogglingPub]  = useState(false);

  const canDelete  = trip.status !== "COMPLETED";
  const isDraft    = trip.status === "DRAFT";
  const isActive   = ["PUBLISHED", "IN_PROGRESS"].includes(trip.status);

  const handleDelete = async () => {
    setDeleting(true);
    const res = await fetch(`/api/trips/${trip.id}`, { method: "DELETE" });
    setDeleting(false);
    setConfirmOpen(false);
    if (res.ok) {
      const data = await res.json();
      toast.success(data.deleted ? "Viaje eliminado" : "Viaje cancelado");
      router.refresh();
    } else {
      toast.error("Error al eliminar el viaje");
    }
  };

  const handleTogglePublic = async () => {
    setTogglingPub(true);
    const res = await fetch(`/api/trips/${trip.id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !trip.isPublic }),
    });
    setTogglingPub(false);
    if (res.ok) { toast.success("Visibilidad actualizada"); router.refresh(); }
    else toast.error("Error al actualizar");
  };

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant={statusColors[trip.status] ?? "secondary"}>
                {tripStatusLabel(trip.status)}
              </Badge>
              {trip.isPublic && (
                <Badge variant="outline" className="text-xs">Público</Badge>
              )}
            </div>

            {isOwner && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 -mr-1">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44">
                  <DropdownMenuItem asChild>
                    <Link href={`/trips/${trip.id}`} className="cursor-pointer">
                      <Eye className="h-4 w-4" /> Ver detalles
                    </Link>
                  </DropdownMenuItem>

                  {trip.status !== "CANCELLED" && trip.status !== "COMPLETED" && (
                    <DropdownMenuItem onClick={handleTogglePublic} disabled={togglingPub} className="cursor-pointer">
                      {trip.isPublic
                        ? <><GlobeLock className="h-4 w-4" />Quitar de público</>
                        : <><Globe className="h-4 w-4" />Hacer público</>
                      }
                    </DropdownMenuItem>
                  )}

                  {canDelete && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setConfirmOpen(true)}
                        className="text-destructive cursor-pointer focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        {isDraft ? "Eliminar viaje" : "Cancelar viaje"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <Link href={`/trips/${trip.id}`} className="block">
            <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 leading-snug hover:text-primary transition-colors">
              {trip.title}
            </h3>

            <div className="flex items-center gap-1.5 mb-3 text-sm">
              <div className="flex items-center gap-1 min-w-0">
                <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                <span className="font-medium truncate text-xs">{origin}</span>
              </div>
              {intermediate.length > 0 && (
                <span className="text-muted-foreground text-xs shrink-0">+{intermediate.length}</span>
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
          </Link>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={isDraft ? "¿Eliminar este viaje?" : "¿Cancelar este viaje?"}
        description={
          isDraft
            ? "Esta acción eliminará el viaje permanentemente. No se puede deshacer."
            : "El viaje pasará a estado Cancelado y las reservas activas serán canceladas."
        }
        confirmLabel={isDraft ? "Sí, eliminar" : "Sí, cancelar viaje"}
        variant="destructive"
        loading={deleting}
        onConfirm={handleDelete}
        details={
          isActive && trip._count.bookings > 0
            ? [
                `Este viaje tiene ${trip._count.bookings} reserva(s).`,
                "Las reservas pendientes y confirmadas se cancelarán automáticamente.",
              ]
            : undefined
        }
      />
    </>
  );
}
