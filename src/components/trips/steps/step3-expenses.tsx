"use client";
import { useState, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Fuel, Landmark, UtensilsCrossed, BedDouble, ParkingCircle,
  Wrench, Plus, Trash2, RefreshCw, AlertCircle, CheckCircle2,
  TrendingUp, Banknote, Info, CalendarDays, Zap,
} from "lucide-react";
import { formatCurrency, expenseTypeLabel } from "@/lib/utils";
import type { TripDraft } from "../new-trip-form";
import type { ExtraExpense, ExpenseType } from "@/types";

// ── Constantes de mercado México 2025 ────────────────────────────────────────
const SALARY_DAILY_RATE   = 900;   // MXN/día — chofer privado exclusivo
const SALARY_MIN_WAGE     = 278.8; // MXN/día — salario mínimo general 2025
const SALARY_MULTIPLIER   = 3.2;   // veces el salario mínimo
const HOTEL_PER_NIGHT     = 900;   // MXN/noche
const FOOD_PER_DAY        = 250;   // MXN/día

interface Props {
  draft: TripDraft;
  update: (d: Partial<TripDraft>) => void;
  vehicleEfficiency: number | null;
}

interface SegmentData {
  from: string; to: string;
  distanceKm: number | null; tollMXN: number | null;
  loading: boolean; error: boolean;
}

const EXPENSE_ICONS: Record<string, any> = {
  FUEL: Fuel, TOLL: Landmark, FOOD: UtensilsCrossed,
  HOTEL: BedDouble, PARKING: ParkingCircle, MAINTENANCE: Wrench, OTHER: Plus,
};
const EXPENSE_TYPES: ExpenseType[] = ["FOOD", "HOTEL", "PARKING", "MAINTENANCE", "OTHER"];

export function Step3Expenses({ draft, update, vehicleEfficiency }: Props) {
  const [segments, setSegments]     = useState<SegmentData[]>([]);
  const [loadingAll, setLoadingAll] = useState(false);
  const isMultiDay = draft.tripType === "MULTI_DAY";

  // Total de días del viaje (entre primera salida y última llegada)
  const totalDays = (() => {
    const first = draft.stops[0]?.departureDate;
    const last  = draft.stops[draft.stops.length - 1]?.arrivalDate;
    if (!first || !last) return 1;
    const diff = Math.round(
      (new Date(last).getTime() - new Date(first).getTime()) / 86400000
    );
    return Math.max(diff + 1, 1);
  })();

  const validStops = draft.stops.filter((s) => s.lat && s.lng && s.city);

  const fetchSegments = useCallback(async () => {
    if (validStops.length < 2) return;
    setLoadingAll(true);

    const initial: SegmentData[] = validStops.slice(0, -1).map((s, i) => ({
      from: s.city, to: validStops[i + 1].city,
      distanceKm: null, tollMXN: null, loading: true, error: false,
    }));
    setSegments(initial);

    const results = await Promise.all(
      validStops.slice(0, -1).map(async (from, i) => {
        const to = validStops[i + 1];
        try {
          const res = await fetch(
            `/api/maps/route?fromLat=${from.lat}&fromLng=${from.lng}&toLat=${to.lat}&toLng=${to.lng}`
          );
          if (!res.ok) return { distanceKm: null, tollMXN: null, error: true };
          return await res.json();
        } catch {
          return { distanceKm: null, tollMXN: null, error: true };
        }
      })
    );

    setSegments(initial.map((seg, i) => ({
      ...seg,
      distanceKm: results[i]?.distanceKm ?? null,
      tollMXN:    results[i]?.tollMXN    ?? null,
      loading: false,
      error:   results[i]?.error ?? false,
    })));
    setLoadingAll(false);
  }, [validStops.length]);

  useEffect(() => {
    if (validStops.length >= 2) fetchSegments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Cálculos ──────────────────────────────────────────────────────────────
  const totalDistanceKm = segments.reduce((s, seg) => s + (seg.distanceKm ?? 0), 0);
  const totalTollsMXN   = segments.reduce((s, seg) => s + (seg.tollMXN   ?? 0), 0);
  const totalFuelMXN    = vehicleEfficiency
    ? (totalDistanceKm / vehicleEfficiency) * draft.fuelPrice
    : 0;
  const totalExtrasMXN  = draft.extraExpenses.reduce((s, e) => s + e.amount, 0);

  // Salario conductor para multi-día
  const salaryTotal  = isMultiDay ? draft.driverDailyRate * totalDays : 0;
  const hotelTotal   = isMultiDay ? Math.max(totalDays - 1, 0) * HOTEL_PER_NIGHT : 0;
  const foodTotal    = isMultiDay ? totalDays * FOOD_PER_DAY : 0;

  // Subtotal de costos reales
  const costsSubtotal = totalFuelMXN + totalTollsMXN + totalExtrasMXN
    + (isMultiDay ? hotelTotal + foodTotal : 0);

  // Ganancia / total
  const profitAmt  = isMultiDay
    ? salaryTotal                                      // Para multi-día: el salario ES la ganancia
    : costsSubtotal * (draft.profitMargin / 100);      // Para express: % sobre costos

  const total          = costsSubtotal + profitAmt;
  const pricePerPax    = draft.maxPassengers > 0 ? total / draft.maxPassengers : 0;

  const addExtra = () =>
    update({ extraExpenses: [...draft.extraExpenses, { type: "FOOD", description: "", amount: 0 }] });
  const updateExtra = (i: number, e: ExtraExpense) => {
    const extras = [...draft.extraExpenses]; extras[i] = e; update({ extraExpenses: extras });
  };
  const removeExtra = (i: number) =>
    update({ extraExpenses: draft.extraExpenses.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Cálculo de gastos y ganancia</h2>
        <p className="text-sm text-muted-foreground">
          {isMultiDay
            ? "Para viajes multi-día calculamos tus costos reales más tu salario diario como conductor."
            : "Calculamos gasolina y casetas automáticamente. Ajusta tu margen de ganancia."}
        </p>
      </div>

      {/* ── Banner tipo de viaje ──────────────────────────────────────── */}
      <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium
        ${isMultiDay ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-blue-50 border border-blue-200 text-blue-800"}`}>
        {isMultiDay ? <CalendarDays className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
        {isMultiDay ? `Privado Multi-día · ${totalDays} día${totalDays !== 1 ? "s" : ""}` : "Traslado Express"}
      </div>

      {/* ── Tramos de ruta ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Landmark className="h-4 w-4 text-amber-500" />
              Tramos de ruta
            </CardTitle>
            <Button
              variant="outline" size="sm"
              onClick={fetchSegments}
              disabled={loadingAll || validStops.length < 2}
              className="h-7 text-xs gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${loadingAll ? "animate-spin" : ""}`} />
              Recalcular
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          {segments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              {validStops.length < 2
                ? "Agrega al menos 2 ciudades en el paso anterior"
                : "Recalcula para obtener distancias y casetas"}
            </p>
          )}
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{seg.from} → {seg.to}</p>
              </div>
              {seg.loading ? (
                <span className="text-xs text-muted-foreground animate-pulse">Calculando…</span>
              ) : seg.error ? (
                <div className="flex items-center gap-1 text-xs text-amber-600">
                  <AlertCircle className="h-3 w-3" /> Error
                </div>
              ) : (
                <div className="flex gap-4 text-xs">
                  <span className="text-muted-foreground">{seg.distanceKm?.toFixed(0)} km</span>
                  <span className="text-amber-600 font-medium">
                    {seg.tollMXN && seg.tollMXN > 0 ? formatCurrency(seg.tollMXN) : "Sin casetas"}
                  </span>
                </div>
              )}
            </div>
          ))}
          {segments.length > 0 && !loadingAll && (
            <div className="flex justify-between pt-2 border-t text-xs font-semibold">
              <span>Total: {totalDistanceKm.toFixed(0)} km</span>
              <span className="text-amber-600">Casetas: {formatCurrency(totalTollsMXN)}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Gasolina ───────────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Fuel className="h-4 w-4 text-blue-500" />
            Gasolina
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          {!vehicleEfficiency && (
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              Sin vehículo registrado. Agrega tu rendimiento en perfil para calcular automáticamente.
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Rendimiento</Label>
              <div className="flex items-center gap-2">
                <Input type="number" min="1" step="0.5" value={vehicleEfficiency ?? 10}
                  disabled={!!vehicleEfficiency} className="text-xs" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">km/L</span>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Precio gasolina</Label>
              <div className="flex items-center gap-2">
                <Input type="number" min="1" step="0.5" value={draft.fuelPrice}
                  onChange={(e) => update({ fuelPrice: parseFloat(e.target.value) || 23.5 })}
                  className="text-xs" />
                <span className="text-xs text-muted-foreground whitespace-nowrap">MXN/L</span>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center rounded-lg bg-blue-50 px-3 py-2">
            <span className="text-xs text-blue-700">Costo estimado de gasolina</span>
            <span className="text-sm font-bold text-blue-700">
              {vehicleEfficiency ? formatCurrency(totalFuelMXN) : "—"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* ── Salario conductor (solo multi-día) ─────────────────────────── */}
      {isMultiDay && (
        <Card className="border-emerald-200">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Banknote className="h-4 w-4 text-emerald-600" />
              Tu salario como conductor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-0">
            {/* Análisis salarial */}
            <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-2">
              <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                <Info className="h-3.5 w-3.5" />
                Análisis de mercado — Chofer privado México 2025
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs text-emerald-700">
                <div className="space-y-1">
                  <p>Salario mínimo diario</p>
                  <p className="font-semibold">${SALARY_MIN_WAGE}/día</p>
                </div>
                <div className="space-y-1">
                  <p>Multiplicador servicio calificado</p>
                  <p className="font-semibold">×{SALARY_MULTIPLIER}</p>
                </div>
                <div className="space-y-1">
                  <p>Tarifa sugerida (exclusivo)</p>
                  <p className="font-semibold">${SALARY_DAILY_RATE}/día</p>
                </div>
                <div className="space-y-1">
                  <p>Equivalente mensual (22 días)</p>
                  <p className="font-semibold">{formatCurrency(SALARY_DAILY_RATE * 22)}/mes</p>
                </div>
              </div>
              <p className="text-[10px] text-emerald-600 pt-1">
                Para un conductor privado exclusivo multi-día, la tarifa de ${SALARY_DAILY_RATE}/día es competitiva
                frente al promedio de mercado de $800-1,200/día para servicio privado en México.
                Puedes ajustar tu tarifa abajo.
              </p>
            </div>

            {/* Input tarifa */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Tu tarifa diaria</Label>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">$</span>
                  <Input
                    type="number" min="0" step="50"
                    value={draft.driverDailyRate}
                    onChange={(e) => update({ driverDailyRate: parseFloat(e.target.value) || 0 })}
                    className="text-sm font-semibold"
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">/día</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Total salario ({totalDays} días)</Label>
                <div className="flex items-center h-9 rounded-lg bg-emerald-50 border border-emerald-200 px-3">
                  <span className="text-sm font-bold text-emerald-700">{formatCurrency(salaryTotal)}</span>
                </div>
              </div>
            </div>

            {/* Costos de estadía del conductor */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Estadía del conductor (gastos reales)</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border px-3 py-2">
                  <BedDouble className="h-4 w-4 text-purple-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{Math.max(totalDays - 1, 0)} noches × ${HOTEL_PER_NIGHT}</p>
                    <p className="text-xs font-semibold">{formatCurrency(hotelTotal)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 rounded-lg bg-slate-50 border px-3 py-2">
                  <UtensilsCrossed className="h-4 w-4 text-rose-500 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{totalDays} días × ${FOOD_PER_DAY}</p>
                    <p className="text-xs font-semibold">{formatCurrency(foodTotal)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Gastos adicionales ─────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Gastos adicionales</CardTitle>
            <Button variant="outline" size="sm" onClick={addExtra} className="h-7 text-xs gap-1">
              <Plus className="h-3 w-3" /> Agregar
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          {draft.extraExpenses.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-3">
              Sin gastos extra. Puedes agregar peajes especiales, estacionamiento, etc.
            </p>
          )}
          {draft.extraExpenses.map((expense, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border p-2">
              <Select value={expense.type}
                onValueChange={(v) => updateExtra(i, { ...expense, type: v as ExpenseType })}>
                <SelectTrigger className="h-7 w-36 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXPENSE_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="text-xs">{expenseTypeLabel(t)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input placeholder="Descripción" value={expense.description}
                onChange={(e) => updateExtra(i, { ...expense, description: e.target.value })}
                className="flex-1 h-7 text-xs" />
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">$</span>
                <Input type="number" min="0" value={expense.amount}
                  onChange={(e) => updateExtra(i, { ...expense, amount: parseFloat(e.target.value) || 0 })}
                  className="w-24 h-7 text-xs" />
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                onClick={() => removeExtra(i)}>
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ── Margen de ganancia (solo express) ─────────────────────────── */}
      {!isMultiDay && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-500" />
              Margen de ganancia
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Porcentaje sobre costos</span>
              <Badge variant="info" className="text-sm px-3 py-1 font-bold">{draft.profitMargin}%</Badge>
            </div>
            <Slider
              min={0} max={100} step={5}
              value={[draft.profitMargin]}
              onValueChange={([v]) => update({ profitMargin: v })}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0% (solo cubrir gastos)</span>
              <span>100%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Resumen total ──────────────────────────────────────────────── */}
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardContent className="p-4 space-y-2">
          {/* Costos reales */}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Costos del viaje</p>
          {[
            { label: "Gasolina", value: vehicleEfficiency ? formatCurrency(totalFuelMXN) : "—" },
            { label: "Casetas", value: formatCurrency(totalTollsMXN) },
            ...(isMultiDay ? [
              { label: `Hotel conductor (${Math.max(totalDays - 1, 0)} noches)`, value: formatCurrency(hotelTotal) },
              { label: `Viáticos conductor (${totalDays} días)`, value: formatCurrency(foodTotal) },
            ] : []),
            { label: "Extras", value: formatCurrency(totalExtrasMXN) },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}

          <Separator className="my-2" />

          {/* Ganancia / salario */}
          {isMultiDay ? (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <Banknote className="h-3.5 w-3.5" />
                Tu salario ({totalDays} días × ${draft.driverDailyRate})
              </span>
              <span className="font-bold text-emerald-700">{formatCurrency(salaryTotal)}</span>
            </div>
          ) : (
            <div className="flex justify-between text-sm">
              <span className="text-emerald-700 font-medium flex items-center gap-1.5">
                <TrendingUp className="h-3.5 w-3.5" />
                Tu ganancia ({draft.profitMargin}%)
              </span>
              <span className="font-bold text-emerald-700">{formatCurrency(profitAmt)}</span>
            </div>
          )}

          <Separator className="my-2" />

          <div className="flex justify-between font-semibold">
            <span>Total del viaje</span>
            <span className="text-lg">{formatCurrency(total)}</span>
          </div>

          <div className="flex justify-between items-center rounded-xl bg-emerald-600 text-white px-4 py-3 mt-2">
            <span className="text-sm font-medium">Precio por pasajero ({draft.maxPassengers} pax)</span>
            <span className="text-2xl font-bold">{formatCurrency(pricePerPax)}</span>
          </div>

          {isMultiDay && (
            <p className="text-[10px] text-center text-muted-foreground pt-1">
              Tarifa diaria ${draft.driverDailyRate} · Hotel ${HOTEL_PER_NIGHT}/noche · Viáticos ${FOOD_PER_DAY}/día
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
