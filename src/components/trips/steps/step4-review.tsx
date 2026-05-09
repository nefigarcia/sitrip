"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MapPin, Users, Calendar, Fuel, Landmark, CheckCircle2, Globe } from "lucide-react";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import type { TripDraft } from "../new-trip-form";
import { useState } from "react";

interface Props {
  draft: TripDraft;
  vehicleEfficiency: number | null;
  onSubmit: (publish: boolean) => void;
  loading: boolean;
}

export function Step4Review({ draft, vehicleEfficiency, onSubmit, loading }: Props) {
  const [makePublic, setMakePublic] = useState(false);

  const validStops = draft.stops.filter((s) => s.city);
  const totalExtras = draft.extraExpenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Revisar y publicar</h2>
        <p className="text-sm text-muted-foreground">
          Verifica los detalles antes de crear el viaje
        </p>
      </div>

      {/* Trip info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Información del viaje</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground">Nombre</p>
            <p className="font-semibold">{draft.title}</p>
          </div>
          {draft.description && (
            <div>
              <p className="text-xs text-muted-foreground">Descripción</p>
              <p className="text-sm">{draft.description}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{draft.maxPassengers} pasajero{draft.maxPassengers !== 1 ? "s" : ""} máximo</span>
          </div>
        </CardContent>
      </Card>

      {/* Route */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-500" />
            Ruta ({validStops.length} {validStops.length === 1 ? "parada" : "paradas"})
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative pl-4 border-l-2 border-dashed border-slate-200 space-y-3">
            {validStops.map((stop, i) => (
              <div key={i} className="relative">
                <div className={`absolute -left-[21px] h-4 w-4 rounded-full border-2 border-white ${i === 0 ? "bg-emerald-500" : i === validStops.length - 1 ? "bg-rose-500" : "bg-blue-400"}`} />
                <div>
                  <p className="text-sm font-medium">{stop.city}{stop.state ? `, ${stop.state}` : ""}</p>
                  {(stop.arrivalDate || stop.departureDate) && (
                    <p className="text-xs text-muted-foreground">
                      {stop.departureDate ? `Sale: ${formatDateTime(stop.departureDate)}` : ""}
                      {stop.arrivalDate && stop.departureDate ? " · " : ""}
                      {stop.arrivalDate ? `Llega: ${formatDateTime(stop.arrivalDate)}` : ""}
                    </p>
                  )}
                  {stop.notes && <p className="text-xs text-muted-foreground italic">{stop.notes}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Extra expenses */}
      {draft.extraExpenses.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Gastos extras</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-1.5">
            {draft.extraExpenses.map((e, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{e.description || e.type}</span>
                <span>{formatCurrency(e.amount)}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Config */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Precio gasolina</span>
            <span>${draft.fuelPrice}/L</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Margen de ganancia</span>
            <span>{draft.profitMargin}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Gastos extras</span>
            <span>{formatCurrency(totalExtras)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Visibility */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                Publicar en la plataforma
              </Label>
              <p className="text-xs text-muted-foreground">
                Los pasajeros podrán ver y solicitar unirse a este viaje
              </p>
            </div>
            <Switch checked={makePublic} onCheckedChange={setMakePublic} />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onSubmit(false)}
          loading={loading}
          disabled={loading}
        >
          Guardar como borrador
        </Button>
        <Button
          className="flex-1"
          variant="success"
          onClick={() => onSubmit(makePublic)}
          loading={loading}
          disabled={loading}
        >
          <CheckCircle2 className="h-4 w-4" />
          {makePublic ? "Crear y publicar" : "Crear viaje"}
        </Button>
      </div>
    </div>
  );
}
