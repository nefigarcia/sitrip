"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Calendar, Users, DollarSign, ArrowRight, Phone, CheckCircle2, XCircle, Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { formatCurrency, formatDate, requestStatusLabel, getInitials, fuelTypeLabel } from "@/lib/utils";

const offerStatusColors: Record<string, any> = {
  PENDING: "warning",
  ACCEPTED: "success",
  REJECTED: "destructive",
};

interface RequestDetailProps {
  request: any;
  isOwner: boolean;
  hasOffer: boolean;
  userId: string;
}

export function RequestDetailView({ request, isOwner, hasOffer, userId }: RequestDetailProps) {
  const router = useRouter();
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleOffer = async () => {
    if (!offerAmount) { toast.error("Ingresa un monto"); return; }
    setLoading(true);
    const res = await fetch(`/api/requests/${request.id}/offers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: parseFloat(offerAmount), message: offerMessage }),
    });
    if (res.ok) {
      toast.success("¡Oferta enviada! El pasajero te contactará.");
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al enviar oferta");
    }
    setLoading(false);
  };

  const handleOfferStatus = async (offerId: string, status: string) => {
    const res = await fetch(`/api/requests/${request.id}/offers`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offerId, status }),
    });
    if (res.ok) { toast.success("Oferta actualizada"); router.refresh(); }
    else toast.error("Error al actualizar");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap gap-2 mb-2">
            <Badge variant={request.status === "OPEN" ? "success" : "secondary"}>
              {requestStatusLabel(request.status)}
            </Badge>
          </div>
          {request.description && (
            <p className="text-sm text-muted-foreground">{request.description}</p>
          )}
        </div>
      </div>

      {/* Details */}
      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <MapPin className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium flex items-center gap-2">
                {request.origin}
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                {request.destination}
              </p>
              <p className="text-xs text-muted-foreground">Ruta del viaje</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-muted-foreground">Fecha salida</p>
              <p className="text-sm font-medium">{formatDate(request.startDate)}</p>
            </div>
            {request.endDate && (
              <div>
                <p className="text-xs text-muted-foreground">Fecha regreso</p>
                <p className="text-sm font-medium">{formatDate(request.endDate)}</p>
              </div>
            )}
            <div>
              <p className="text-xs text-muted-foreground">Pasajeros</p>
              <p className="text-sm font-medium">{request.passengers}</p>
            </div>
          </div>

          {request.budget && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2">
              <DollarSign className="h-4 w-4 text-emerald-600" />
              <span className="text-sm text-emerald-700">
                Presupuesto máximo: <strong>{formatCurrency(request.budget)}</strong>
              </span>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={request.passenger.avatar ?? ""} />
              <AvatarFallback className="text-xs">{getInitials(request.passenger.name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{request.passenger.name}</p>
              <p className="text-xs text-muted-foreground">Pasajero</p>
            </div>
            {request.passenger.phone && !isOwner && (
              <a href={`tel:${request.passenger.phone}`} className="ml-auto text-blue-600 hover:underline flex items-center gap-1 text-sm">
                <Phone className="h-3.5 w-3.5" />
                {request.passenger.phone}
              </a>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Driver offer form */}
      {!isOwner && request.status === "OPEN" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              {hasOffer ? "Ya enviaste una oferta" : "Enviar oferta como conductor"}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {hasOffer ? (
              <p className="text-sm text-muted-foreground">
                Tu oferta está pendiente de revisión por el pasajero.
              </p>
            ) : (
              <>
                <div className="space-y-1.5">
                  <Label>Tu precio total (MXN)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                    <Input
                      type="number"
                      min={0}
                      placeholder="ej: 3500"
                      className="pl-7"
                      value={offerAmount}
                      onChange={(e) => setOfferAmount(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Mensaje para el pasajero</Label>
                  <Textarea
                    placeholder="Preséntate, comenta tu experiencia, vehículo, lo que incluye el precio..."
                    rows={3}
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                  />
                </div>
                <Button className="w-full" onClick={handleOffer} loading={loading}>
                  <Car className="h-4 w-4" />
                  Enviar oferta
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Offers list */}
      {request.offers.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">
              Ofertas de conductores ({request.offers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">
            {request.offers.map((offer: any) => (
              <div key={offer.id} className="rounded-xl border p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={offer.driver.avatar ?? ""} />
                    <AvatarFallback className="text-xs">{getInitials(offer.driver.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium">{offer.driver.name}</p>
                      <Badge variant={offerStatusColors[offer.status] ?? "secondary"} className="text-xs shrink-0">
                        {offer.status === "PENDING" ? "Pendiente" : offer.status === "ACCEPTED" ? "Aceptada" : "Rechazada"}
                      </Badge>
                    </div>
                    {offer.driver.vehicle && (
                      <p className="text-xs text-muted-foreground">
                        {offer.driver.vehicle.brand} {offer.driver.vehicle.model} {offer.driver.vehicle.year} · {fuelTypeLabel(offer.driver.vehicle.fuelType)}
                      </p>
                    )}
                    {offer.message && (
                      <p className="text-sm mt-2 text-muted-foreground">{offer.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-emerald-600">{formatCurrency(offer.amount)}</div>
                  {isOwner && offer.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="success"
                        onClick={() => handleOfferStatus(offer.id, "ACCEPTED")}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Aceptar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive"
                        onClick={() => handleOfferStatus(offer.id, "REJECTED")}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Rechazar
                      </Button>
                    </div>
                  )}
                  {offer.status === "ACCEPTED" && offer.driver.phone && (
                    <a href={`tel:${offer.driver.phone}`} className="text-blue-600 hover:underline flex items-center gap-1 text-sm">
                      <Phone className="h-3.5 w-3.5" />
                      {offer.driver.phone}
                    </a>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
