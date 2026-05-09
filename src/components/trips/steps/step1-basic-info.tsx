"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Users, FileText, Info, Zap, CalendarDays, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TripDraft } from "../new-trip-form";

interface Props {
  draft: TripDraft;
  update: (d: Partial<TripDraft>) => void;
}

const TRIP_TYPES = [
  {
    value: "EXPRESS" as const,
    icon: Zap,
    color: "blue",
    title: "Traslado Express",
    desc: "Un trayecto directo de A a B. El precio se calcula sobre los costos reales más tu margen de ganancia.",
    features: ["Un solo trayecto", "Mismo día o fecha específica", "Precio por km + casetas"],
  },
  {
    value: "MULTI_DAY" as const,
    icon: CalendarDays,
    color: "emerald",
    title: "Privado Multi-día",
    desc: "Acompañas al pasajero varios días con múltiples destinos. El precio incluye tu salario diario como conductor.",
    features: ["Varios días exclusivos para el pasajero", "Múltiples ciudades en una semana", "Incluye tu salario + hotel + viáticos"],
  },
];

export function Step1BasicInfo({ draft, update }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Tipo e información del viaje</h2>
        <p className="text-sm text-muted-foreground">Elige el tipo de viaje y completa los datos básicos</p>
      </div>

      {/* Selector de tipo */}
      <div className="space-y-2">
        <Label>Tipo de viaje *</Label>
        <div className="grid sm:grid-cols-2 gap-3">
          {TRIP_TYPES.map(({ value, icon: Icon, color, title, desc, features }) => {
            const selected = draft.tripType === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => update({ tripType: value })}
                className={cn(
                  "text-left rounded-xl border-2 p-4 transition-all",
                  selected
                    ? color === "blue"
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-emerald-500 bg-emerald-50/50"
                    : "border-border hover:border-muted-foreground/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    selected
                      ? color === "blue" ? "bg-blue-100" : "bg-emerald-100"
                      : "bg-muted"
                  )}>
                    <Icon className={cn(
                      "h-5 w-5",
                      selected
                        ? color === "blue" ? "text-blue-600" : "text-emerald-600"
                        : "text-muted-foreground"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold text-sm", selected && (color === "blue" ? "text-blue-800" : "text-emerald-800"))}>
                      {title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{desc}</p>
                    {selected && (
                      <ul className="mt-2 space-y-1">
                        {features.map((f) => (
                          <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className={cn("h-1 w-1 rounded-full shrink-0", color === "blue" ? "bg-blue-400" : "bg-emerald-400")} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {selected && (
                    <div className={cn(
                      "h-5 w-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                      color === "blue" ? "bg-blue-500" : "bg-emerald-500"
                    )}>
                      <ChevronRight className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Nombre del viaje */}
      <div className="space-y-1.5">
        <Label htmlFor="title">
          Nombre del viaje <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="title"
            placeholder={
              draft.tripType === "MULTI_DAY"
                ? "ej: Tour familiar 5 días Querétaro → CDMX → Puebla"
                : "ej: Traslado Querétaro → Aeropuerto CDMX"
            }
            className="pl-9"
            value={draft.title}
            onChange={(e) => update({ title: e.target.value })}
            maxLength={100}
          />
        </div>
        <p className="text-xs text-muted-foreground text-right">{draft.title.length}/100</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Descripción (opcional)</Label>
        <Textarea
          id="description"
          placeholder="Describe el viaje, servicios incluidos, comodidades del vehículo..."
          rows={2}
          value={draft.description}
          onChange={(e) => update({ description: e.target.value })}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="passengers">
          Número máximo de pasajeros <span className="text-destructive">*</span>
        </Label>
        <div className="relative">
          <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="passengers"
            type="number"
            min={1}
            max={20}
            className="pl-9 w-32"
            value={draft.maxPassengers}
            onChange={(e) => update({ maxPassengers: parseInt(e.target.value) || 1 })}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notas para los pasajeros (opcional)</Label>
        <Textarea
          id="notes"
          placeholder="Políticas del viaje, qué incluye, qué no incluye..."
          rows={2}
          value={draft.notes}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      <Card className="border-blue-100 bg-blue-50/50">
        <CardContent className="p-4 flex gap-3">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            {draft.tripType === "MULTI_DAY"
              ? "Para viajes multi-día, en el paso de gastos calcularemos tu salario diario como conductor basado en el mercado mexicano 2025."
              : "En el paso de gastos calcularemos gasolina, casetas y tu margen de ganancia."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
