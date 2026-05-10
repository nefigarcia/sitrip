"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, ArrowRight, Users, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { formatCurrency, formatDate, bookingStatusLabel, getInitials } from "@/lib/utils";
import { cn } from "@/lib/utils";

const statusColors: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  PENDING:   "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

function BookingCard({
  booking, mode,
}: {
  booking: any;
  mode: "passenger" | "driver";
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [cancelling,  setCancelling]  = useState(false);

  const trip  = booking.trip;
  const stops = [...(trip.stops ?? [])].sort((a: any, b: any) => a.order - b.order);
  const origin = stops[0]?.city ?? "—";
  const dest   = stops[stops.length - 1]?.city ?? "—";

  const canCancel = ["PENDING", "CONFIRMED"].includes(booking.status);
  const person    = mode === "passenger" ? trip.driver : booking.passenger;

  const handleCancel = async () => {
    setCancelling(true);
    const res = await fetch(`/api/bookings/${booking.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    setCancelling(false);
    setConfirmOpen(false);
    if (res.ok) {
      toast.success("Reserva cancelada");
      router.refresh();
    } else {
      toast.error("Error al cancelar la reserva");
    }
  };

  return (
    <>
      <Card className={cn("transition-all", booking.status === "CANCELLED" && "opacity-60")}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <Badge variant={statusColors[booking.status] ?? "secondary"}>
              {bookingStatusLabel(booking.status)}
            </Badge>
            <span className="text-xs text-muted-foreground">{formatDate(booking.createdAt)}</span>
          </div>

          <Link href={`/trips/${trip.id}`} className="block hover:opacity-80 transition-opacity">
            <h3 className="font-semibold text-sm mb-2 line-clamp-1">{trip.title}</h3>
            <div className="flex items-center gap-1.5 text-xs mb-3">
              <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <span className="truncate font-medium">{origin}</span>
              <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
              <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
              <span className="truncate font-medium">{dest}</span>
            </div>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-7 w-7">
                <AvatarImage src={person?.avatar ?? ""} />
                <AvatarFallback className="text-xs">{getInitials(person?.name ?? "?")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-xs font-medium">{person?.name}</p>
                <p className="text-[10px] text-muted-foreground">
                  {mode === "passenger" ? "Conductor" : "Pasajero"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-muted-foreground justify-end">
                  <Users className="h-3 w-3" />
                  {booking.passengers} pax
                </div>
                {booking.totalAmount && (
                  <p className="text-xs font-semibold text-emerald-600">{formatCurrency(booking.totalAmount)}</p>
                )}
              </div>

              {canCancel && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive border-destructive hover:bg-destructive/10 h-7 text-xs gap-1"
                  onClick={() => setConfirmOpen(true)}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          {booking.notes && (
            <p className="text-xs text-muted-foreground mt-2 pt-2 border-t italic">{booking.notes}</p>
          )}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="¿Cancelar esta reserva?"
        description={
          mode === "passenger"
            ? "Se notificará al conductor que cancelaste tu lugar en el viaje."
            : "Se cancelará la reserva de este pasajero."
        }
        confirmLabel="Sí, cancelar reserva"
        variant="warning"
        loading={cancelling}
        onConfirm={handleCancel}
        details={
          booking.status === "CONFIRMED"
            ? ["Esta reserva ya estaba confirmada.", "Considera contactar al conductor para informarle."]
            : undefined
        }
      />
    </>
  );
}

export function BookingsList({ bookings, mode }: { bookings: any[]; mode: "passenger" | "driver" }) {
  const pending   = bookings.filter((b) => b.status === "PENDING");
  const confirmed = bookings.filter((b) => b.status === "CONFIRMED");
  const others    = bookings.filter((b) => !["PENDING", "CONFIRMED"].includes(b.status));

  const Section = ({ title, items }: { title: string; items: any[] }) =>
    items.length > 0 ? (
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</p>
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {items.map((b) => <BookingCard key={b.id} booking={b} mode={mode} />)}
        </div>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <Section title="Pendientes de confirmación" items={pending} />
      <Section title="Confirmadas" items={confirmed} />
      <Section title="Historial" items={others} />
    </div>
  );
}
