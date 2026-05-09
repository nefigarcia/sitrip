"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  MapPin, Users, Calendar, Fuel, Landmark, Globe, GlobeLock,
  CheckCircle2, XCircle, Clock, Phone, Mail, ArrowRight,
  Edit, Trash2, UserCheck, BadgeCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  formatCurrency, formatDateTime, tripStatusLabel,
  bookingStatusLabel, expenseTypeLabel, getInitials,
} from "@/lib/utils";

const statusColors: Record<string, any> = {
  DRAFT: "secondary",
  PUBLISHED: "info",
  IN_PROGRESS: "warning",
  COMPLETED: "success",
  CANCELLED: "destructive",
  PENDING: "warning",
  CONFIRMED: "success",
};

interface Trip {
  id: string;
  title: string;
  description: string | null;
  status: string;
  startDate: Date;
  endDate: Date;
  totalDistance: number | null;
  totalFuel: number | null;
  totalTolls: number | null;
  totalExtras: number | null;
  profitMargin: number;
  pricePerPassenger: number | null;
  maxPassengers: number;
  currentPassengers: number;
  fuelPrice: number;
  isPublic: boolean;
  notes: string | null;
  driver: { name: string; email: string; phone: string | null; avatar: string | null };
  stops: any[];
  expenses: any[];
  bookings: any[];
}

export function TripDetail({ trip, isOwner, userId }: { trip: Trip; isOwner: boolean; userId: string }) {
  const router = useRouter();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookPassengers, setBookPassengers] = useState(1);
  const [bookNotes, setBookNotes] = useState("");
  const [bookPhone, setBookPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  const subtotal = (trip.totalFuel ?? 0) + (trip.totalTolls ?? 0) + (trip.totalExtras ?? 0);
  const profitAmt = subtotal * (trip.profitMargin / 100);
  const total = subtotal + profitAmt;

  const handlePublish = async () => {
    setStatusLoading(true);
    const res = await fetch(`/api/trips/${trip.id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !trip.isPublic, status: trip.status === "DRAFT" ? "PUBLISHED" : trip.status }),
    });
    if (res.ok) { toast.success("Estado actualizado"); router.refresh(); }
    else toast.error("Error al actualizar");
    setStatusLoading(false);
  };

  const handleStatusChange = async (status: string) => {
    setStatusLoading(true);
    const res = await fetch(`/api/trips/${trip.id}/publish`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success("Estado actualizado"); router.refresh(); }
    else toast.error("Error al actualizar");
    setStatusLoading(false);
  };

  const handleBooking = async () => {
    setLoading(true);
    const res = await fetch(`/api/trips/${trip.id}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passengers: bookPassengers, notes: bookNotes, contactPhone: bookPhone }),
    });
    if (res.ok) {
      toast.success("¡Solicitud enviada! El conductor te confirmará.");
      setBookingOpen(false);
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al reservar");
    }
    setLoading(false);
  };

  const handleBookingStatus = async (bookingId: string, status: string) => {
    const res = await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) { toast.success("Reserva actualizada"); router.refresh(); }
    else toast.error("Error al actualizar la reserva");
  };

  const alreadyBooked = !isOwner && trip.bookings.some((b) => b.passenger?.id === userId || b.passengerId === userId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant={statusColors[trip.status]}>{tripStatusLabel(trip.status)}</Badge>
            {trip.isPublic ? (
              <Badge variant="info" className="gap-1"><Globe className="h-3 w-3" />Público</Badge>
            ) : (
              <Badge variant="secondary" className="gap-1"><GlobeLock className="h-3 w-3" />Privado</Badge>
            )}
          </div>
          {trip.description && (
            <p className="text-sm text-muted-foreground">{trip.description}</p>
          )}
        </div>

        {isOwner && (
          <div className="flex gap-2 flex-wrap">
            {trip.status === "DRAFT" && (
              <Button size="sm" variant="success" onClick={() => handleStatusChange("PUBLISHED")} loading={statusLoading}>
                <CheckCircle2 className="h-4 w-4" />
                Publicar
              </Button>
            )}
            {trip.status === "PUBLISHED" && (
              <Button size="sm" variant="outline" onClick={() => handleStatusChange("IN_PROGRESS")} loading={statusLoading}>
                Iniciar viaje
              </Button>
            )}
            {trip.status === "IN_PROGRESS" && (
              <Button size="sm" variant="success" onClick={() => handleStatusChange("COMPLETED")} loading={statusLoading}>
                Completar
              </Button>
            )}
            <Button size="sm" variant={trip.isPublic ? "outline" : "outline"} onClick={handlePublish} loading={statusLoading}>
              {trip.isPublic ? <GlobeLock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
              {trip.isPublic ? "Quitar de público" : "Hacer público"}
            </Button>
          </div>
        )}

        {!isOwner && trip.status === "PUBLISHED" && !alreadyBooked && (
          <Button onClick={() => setBookingOpen(true)} size="sm">
            <UserCheck className="h-4 w-4" />
            Reservar lugar
          </Button>
        )}
        {alreadyBooked && (
          <Badge variant="success" className="gap-1"><BadgeCheck className="h-3.5 w-3.5" />Ya reservaste</Badge>
        )}
      </div>

      {/* Route */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Ruta — {trip.stops.length} paradas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative pl-5 border-l-2 border-dashed border-slate-200 space-y-4">
            {trip.stops.map((stop: any, i: number) => (
              <div key={stop.id} className="relative">
                <div className={`absolute -left-[22px] h-4 w-4 rounded-full border-2 border-white ${i === 0 ? "bg-emerald-500" : i === trip.stops.length - 1 ? "bg-rose-500" : "bg-blue-400"}`} />
                <div>
                  <p className="font-medium text-sm">{stop.city}{stop.state ? `, ${stop.state}` : ""}</p>
                  <p className="text-xs text-muted-foreground">{stop.address}</p>
                  <div className="flex gap-3 mt-0.5">
                    {stop.departureDate && (
                      <span className="text-xs text-muted-foreground">Salida: {formatDateTime(stop.departureDate)}</span>
                    )}
                    {stop.arrivalDate && (
                      <span className="text-xs text-muted-foreground">Llegada: {formatDateTime(stop.arrivalDate)}</span>
                    )}
                  </div>
                  {stop.distanceToNext && (
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span>{stop.distanceToNext.toFixed(0)} km al siguiente</span>
                      {stop.tollToNext !== null && stop.tollToNext > 0 && (
                        <span className="text-amber-600 font-medium">Caseta: {formatCurrency(stop.tollToNext)}</span>
                      )}
                    </div>
                  )}
                  {stop.notes && <p className="text-xs italic text-muted-foreground mt-0.5">{stop.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Cost breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Desglose de costos</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-2">
            {[
              { label: "Distancia total", value: trip.totalDistance ? `${trip.totalDistance.toFixed(0)} km` : "—" },
              { label: "Gasolina", value: trip.totalFuel ? formatCurrency(trip.totalFuel) : "—" },
              { label: "Casetas", value: trip.totalTolls ? formatCurrency(trip.totalTolls) : formatCurrency(0) },
              { label: "Extras", value: trip.totalExtras ? formatCurrency(trip.totalExtras) : formatCurrency(0) },
              { label: `Ganancia (${trip.profitMargin}%)`, value: formatCurrency(profitAmt) },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span>{value}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total viaje</span>
              <span>{formatCurrency(total)}</span>
            </div>
            <div className="flex justify-between items-center rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
              <span className="text-sm font-medium text-emerald-700">Por pasajero ({trip.maxPassengers} pax)</span>
              <span className="text-lg font-bold text-emerald-700">
                {trip.pricePerPassenger ? formatCurrency(trip.pricePerPassenger) : formatCurrency(pricePerPaxCalc(total, trip.maxPassengers))}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Detalles</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDateTime(trip.startDate)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{trip.currentPassengers}/{trip.maxPassengers} pasajeros</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Fuel className="h-4 w-4 text-muted-foreground" />
              <span>${trip.fuelPrice}/L</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={trip.driver.avatar ?? ""} />
                <AvatarFallback className="text-xs">{getInitials(trip.driver.name)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{trip.driver.name}</p>
                <p className="text-xs text-muted-foreground">Conductor</p>
              </div>
            </div>
            {trip.driver.phone && (
              <a href={`tel:${trip.driver.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <Phone className="h-4 w-4" />
                {trip.driver.phone}
              </a>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bookings (owner view) */}
      {isOwner && trip.bookings.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-purple-500" />
              Reservas ({trip.bookings.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {trip.bookings.map((booking: any) => (
              <div key={booking.id} className="flex items-center gap-3 rounded-xl border p-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="text-xs">{getInitials(booking.passenger.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{booking.passenger.name}</p>
                  <p className="text-xs text-muted-foreground">{booking.passenger.email}</p>
                  {booking.contactPhone && (
                    <p className="text-xs text-blue-600">{booking.contactPhone}</p>
                  )}
                  {booking.notes && <p className="text-xs text-muted-foreground mt-0.5 italic">{booking.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant={statusColors[booking.status] ?? "secondary"} className="text-xs">
                    {bookingStatusLabel(booking.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">{booking.passengers} pax</span>
                  {booking.status === "PENDING" && (
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-emerald-600 hover:text-emerald-700"
                        onClick={() => handleBookingStatus(booking.id, "CONFIRMED")}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 text-destructive"
                        onClick={() => handleBookingStatus(booking.id, "CANCELLED")}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {trip.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Notas del conductor</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-muted-foreground">{trip.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Booking dialog */}
      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reservar lugar en el viaje</DialogTitle>
            <DialogDescription>
              El conductor recibirá tu solicitud y te confirmará la reserva.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Número de pasajeros</Label>
              <Input
                type="number"
                min={1}
                max={trip.maxPassengers - trip.currentPassengers}
                value={bookPassengers}
                onChange={(e) => setBookPassengers(parseInt(e.target.value) || 1)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Teléfono de contacto</Label>
              <Input
                type="tel"
                placeholder="+52 442 000 0000"
                value={bookPhone}
                onChange={(e) => setBookPhone(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Notas para el conductor (opcional)</Label>
              <Textarea
                placeholder="Alguna petición especial, punto de recogida..."
                value={bookNotes}
                onChange={(e) => setBookNotes(e.target.value)}
                rows={2}
              />
            </div>
            {trip.pricePerPassenger && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
                <div className="flex justify-between text-sm">
                  <span>Total estimado ({bookPassengers} pax)</span>
                  <span className="font-bold text-emerald-700">
                    {formatCurrency(trip.pricePerPassenger * bookPassengers)}
                  </span>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBookingOpen(false)}>Cancelar</Button>
            <Button onClick={handleBooking} loading={loading}>
              Enviar solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function pricePerPaxCalc(total: number, pax: number) {
  return pax > 0 ? total / pax : 0;
}
