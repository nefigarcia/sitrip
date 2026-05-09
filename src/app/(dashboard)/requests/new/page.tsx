"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Zap, CalendarDays, MapPin, Users, DollarSign,
  Plus, Trash2, ArrowRight, Info, ChevronRight, Sparkles,
  Calculator, Fuel, Landmark, BedDouble, UtensilsCrossed,
  TrendingUp, Loader2, Banknote,
} from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PlacesInput } from "@/components/shared/places-input";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PlaceData {
  city: string; state: string; address: string; name: string;
  lat: number | null; lng: number | null;
}
interface CostBreakdown {
  distanceKm: number; fuelCost: number; tollsCost: number;
  hotelCost: number; foodCost: number; salaryTotal: number;
  costsSubtotal: number; total: number; perPassenger: number;
  isMinivan: boolean; efficiencyKmL: number;
}

const emptyPlace = (): PlaceData => ({ city: "", state: "", address: "", name: "", lat: null, lng: null });
type TripType = "EXPRESS" | "MULTI_DAY";

// ── Constantes de mercado México 2025 ────────────────────────────────────────
const FUEL_PRICE        = 23.5;
const HOTEL_NIGHT       = 900;
const FOOD_DAY          = 250;
const PROFIT_PCT        = 0.30;   // solo para express
const EFF_CAR           = 13;
const EFF_MINIVAN       = 10;
const DRIVER_DAILY_RATE = 900;    // salario diario chofer privado exclusivo
const MIN_WAGE_DAILY    = 278.8;  // salario mínimo México 2025
const SALARY_MULTIPLIER = 3.2;

export default function NewRequestPage() {
  const router = useRouter();
  const [tripType, setTripType]             = useState<TripType | null>(null);
  const [origin, setOrigin]                 = useState<PlaceData>(emptyPlace());
  const [destination, setDestination]       = useState<PlaceData>(emptyPlace());
  const [waypoints, setWaypoints]           = useState<PlaceData[]>([]);
  const [title, setTitle]                   = useState("");
  const [description, setDescription]       = useState("");
  const [startDate, setStartDate]           = useState("");
  const [endDate, setEndDate]               = useState("");
  const [totalDays, setTotalDays]           = useState(2);
  const [daysAutoFilled, setDaysAutoFilled] = useState(false);
  const [passengers, setPassengers]         = useState(1);
  const [driverDailyRate, setDriverDailyRate] = useState(DRIVER_DAILY_RATE);
  const [budget, setBudget]                 = useState("");
  const [submitting, setSubmitting]         = useState(false);
  const [calculating, setCalculating]       = useState(false);
  const [costBreakdown, setCostBreakdown]   = useState<CostBreakdown | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // ── Auto-calcular días ────────────────────────────────────────────────────
  useEffect(() => {
    if (!startDate || !endDate) return;
    const diff = Math.round(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000
    ) + 1;
    if (diff >= 1) { setTotalDays(diff); setDaysAutoFilled(true); }
  }, [startDate, endDate]);

  // ── Auto-calcular costos ──────────────────────────────────────────────────
  useEffect(() => {
    const validStops = [origin, ...waypoints, destination].filter((s) => s.lat && s.lng);
    if (validStops.length < 2 || !tripType) {
      setCostBreakdown(null); setBudget(""); return;
    }

    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setCalculating(true); setCostBreakdown(null);

      let totalDistanceKm = 0, totalTollsMXN = 0;
      try {
        for (let i = 0; i < validStops.length - 1; i++) {
          const from = validStops[i], to = validStops[i + 1];
          const res = await fetch(
            `/api/maps/route?fromLat=${from.lat}&fromLng=${from.lng}&toLat=${to.lat}&toLng=${to.lng}`
          );
          if (res.ok) {
            const data = await res.json();
            totalDistanceKm += data.distanceKm ?? 0;
            totalTollsMXN   += data.tollMXN   ?? 0;
          }
        }

        const isMinivan     = passengers > 3;
        const efficiency    = isMinivan ? EFF_MINIVAN : EFF_CAR;
        const fuelCost      = (totalDistanceKm / efficiency) * FUEL_PRICE;
        const isMultiDay    = tripType === "MULTI_DAY";
        const nights        = isMultiDay ? Math.max(totalDays - 1, 0) : 0;
        const hotelCost     = nights   * HOTEL_NIGHT;
        const foodCost      = isMultiDay ? totalDays * FOOD_DAY : 0;
        const salaryTotal   = isMultiDay ? driverDailyRate * totalDays : 0;
        const costsSubtotal = fuelCost + totalTollsMXN + hotelCost + foodCost;
        // Multi-día: salario ES la ganancia. Express: % sobre costos.
        const total         = isMultiDay
          ? costsSubtotal + salaryTotal
          : costsSubtotal * (1 + PROFIT_PCT);
        const perPassenger  = passengers > 0 ? total / passengers : total;

        setCostBreakdown({
          distanceKm: totalDistanceKm, fuelCost, tollsCost: totalTollsMXN,
          hotelCost, foodCost, salaryTotal, costsSubtotal, total, perPassenger,
          isMinivan, efficiencyKmL: efficiency,
        });
        setBudget(Math.ceil(total).toString());
      } catch { /* silent */ }
      finally { setCalculating(false); }
    }, 800);

    return () => clearTimeout(debounceRef.current);
  }, [
    origin.lat, origin.lng, destination.lat, destination.lng,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    waypoints.map((w) => `${w.lat},${w.lng}`).join("|"),
    passengers, totalDays, tripType, driverDailyRate,
  ]);

  const addWaypoint    = () => setWaypoints((w) => [...w, emptyPlace()]);
  const removeWaypoint = (i: number) => setWaypoints((w) => w.filter((_, idx) => idx !== i));
  const updateWaypoint = (i: number, p: PlaceData) =>
    setWaypoints((w) => w.map((x, idx) => (idx === i ? p : x)));

  const isMinivan  = passengers > 3;
  const allDests   = [origin, ...waypoints, destination].filter((p) => p.city);
  const validStops = [origin, ...waypoints, destination].filter((s) => s.lat && s.lng);

  const autoTitle = () => {
    if (!origin.city || !destination.city) return;
    const stops = [origin.city, ...waypoints.map((w) => w.city).filter(Boolean), destination.city];
    if (tripType === "EXPRESS") setTitle(`Traslado ${origin.city} → ${destination.city}`);
    else setTitle(`Viaje privado ${totalDays} días: ${stops.join(" → ")}`);
  };

  const handleSubmit = async () => {
    if (!origin.city || !destination.city || !startDate || !title) {
      toast.error("Completa origen, destino, fecha y título"); return;
    }
    setSubmitting(true);
    const res = await fetch("/api/requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title, description, tripType,
        origin:      origin.city + (origin.state ? `, ${origin.state}` : ""),
        originLat:   origin.lat, originLng: origin.lng,
        destination: destination.city + (destination.state ? `, ${destination.state}` : ""),
        destLat:     destination.lat, destLng: destination.lng,
        waypoints:   waypoints.length ? JSON.stringify(waypoints.filter((w) => w.city)) : null,
        startDate,   endDate: endDate || null,
        totalDays:   tripType === "MULTI_DAY" ? totalDays : null,
        passengers,
        budget: budget ? parseFloat(budget) : null,
      }),
    });
    if (!res.ok) toast.error((await res.json()).error ?? "Error al publicar");
    else { toast.success("¡Solicitud publicada!"); router.push("/requests"); }
    setSubmitting(false);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // PANTALLA 1: Tipo de viaje
  // ══════════════════════════════════════════════════════════════════════════
  if (!tripType) {
    return (
      <div>
        <TopBar title="Nueva Solicitud" subtitle="¿Qué tipo de viaje necesitas?" />
        <div className="p-4 lg:p-6 max-w-2xl mx-auto animate-fade-in">
          <p className="text-sm text-muted-foreground mb-6">
            Elige el tipo para que los conductores entiendan exactamente lo que necesitas.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              {
                type: "EXPRESS" as TripType, icon: Zap, color: "blue",
                title: "Traslado Express",
                desc: "Un solo trayecto de A a B. Ideal para aeropuertos, eventos o traslados directos.",
                features: ["Un trayecto directo", "Mismo día", "Precio fijo por persona"],
              },
              {
                type: "MULTI_DAY" as TripType, icon: CalendarDays, color: "emerald",
                title: "Privado Multi-día",
                desc: "El mismo conductor te acompaña varios días visitando múltiples destinos.",
                features: ["Varios días con el mismo conductor", "Múltiples destinos", "El conductor espera y regresa contigo"],
              },
            ].map(({ type, icon: Icon, color, title, desc, features }) => (
              <button
                key={type}
                onClick={() => setTripType(type)}
                className={cn(
                  "group text-left rounded-2xl border-2 border-border p-6 transition-all hover:shadow-lg hover:-translate-y-0.5",
                  color === "blue" ? "hover:border-blue-500" : "hover:border-emerald-500"
                )}
              >
                <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-4 transition-colors",
                  color === "blue" ? "bg-blue-50 group-hover:bg-blue-100" : "bg-emerald-50 group-hover:bg-emerald-100")}>
                  <Icon className={cn("h-7 w-7", color === "blue" ? "text-blue-600" : "text-emerald-600")} />
                </div>
                <h3 className="font-bold text-lg mb-1">{title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{desc}</p>
                <div className="space-y-1.5 mb-4">
                  {features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={cn("h-1.5 w-1.5 rounded-full shrink-0", color === "blue" ? "bg-blue-400" : "bg-emerald-400")} />
                      {f}
                    </div>
                  ))}
                </div>
                <div className={cn("flex items-center gap-1 text-sm font-medium", color === "blue" ? "text-blue-600" : "text-emerald-600")}>
                  Seleccionar <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
            <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700">
              <strong>Ejemplo multi-día:</strong> Visitar Querétaro, San Miguel y Guanajuato
              en 5 días con tu familia. El conductor te recoge el lunes y regresa el viernes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isExpress  = tripType === "EXPRESS";
  const isMultiDay = tripType === "MULTI_DAY";

  // ══════════════════════════════════════════════════════════════════════════
  // PANTALLA 2: Formulario
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div>
      <TopBar
        title={isExpress ? "Traslado Express" : "Privado Multi-día"}
        subtitle="El presupuesto se calcula automáticamente"
      />
      <div className="p-4 lg:p-6 max-w-2xl mx-auto animate-fade-in space-y-4">

        <button onClick={() => setTripType(null)} className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          ← Cambiar tipo
        </button>

        <div className={cn("inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
          isExpress ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700")}>
          {isExpress ? <Zap className="h-3.5 w-3.5" /> : <CalendarDays className="h-3.5 w-3.5" />}
          {isExpress ? "Traslado Express" : "Privado Multi-día"}
        </div>

        {/* ── Ruta ──────────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm font-semibold">Ruta del viaje</p>
            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5 text-emerald-500" />Origen *
              </Label>
              <PlacesInput value={origin.city} placeholder="ej: Querétaro, Qro." iconColor="text-emerald-500" onPlaceSelect={setOrigin} />
            </div>

            {isMultiDay && (
              <div className="space-y-2">
                {waypoints.map((wp, i) => (
                  <div key={i} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs text-muted-foreground">Parada {i + 1}</Label>
                      <PlacesInput value={wp.city} placeholder="ej: San Miguel de Allende" iconColor="text-blue-400" onPlaceSelect={(p) => updateWaypoint(i, p)} />
                    </div>
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0" onClick={() => removeWaypoint(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full border-dashed text-xs" onClick={addWaypoint} disabled={waypoints.length >= 6}>
                  <Plus className="h-3.5 w-3.5" /> Agregar destino intermedio
                </Button>
              </div>
            )}

            {allDests.length >= 2 && (
              <div className="flex flex-wrap items-center gap-1 rounded-lg bg-slate-50 px-3 py-2">
                {allDests.map((d, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs">
                    <span className="font-medium">{d.city}</span>
                    {i < allDests.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                  </span>
                ))}
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                <MapPin className="h-3.5 w-3.5 text-rose-500" />
                {isMultiDay ? "Destino final / regreso *" : "Destino *"}
              </Label>
              <PlacesInput value={destination.city} placeholder={isMultiDay ? "ej: Querétaro (regreso)" : "ej: AICM, CDMX"} iconColor="text-rose-500" onPlaceSelect={setDestination} />
            </div>
          </CardContent>
        </Card>

        {/* ── Fechas ────────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm font-semibold">Fechas</p>
            <div className={cn("grid gap-4", isMultiDay ? "grid-cols-3" : "grid-cols-2")}>
              <div className="space-y-1.5">
                <Label className="text-xs">Fecha de salida *</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">{isMultiDay ? "Fecha de regreso" : "Fecha de regreso (opcional)"}</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              {isMultiDay && (
                <div className="space-y-1.5">
                  <Label className="text-xs flex items-center gap-1.5">
                    <CalendarDays className="h-3 w-3" />Total días
                    {daysAutoFilled && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-1.5 py-0">
                        <Sparkles className="h-2.5 w-2.5" />Auto
                      </span>
                    )}
                  </Label>
                  <Input
                    type="number" min={1} max={30} value={totalDays}
                    onChange={(e) => { setTotalDays(parseInt(e.target.value) || 1); setDaysAutoFilled(false); }}
                    className={daysAutoFilled ? "border-emerald-300 bg-emerald-50/50" : ""}
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* ── Pasajeros ─────────────────────────────────────────────── */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm font-semibold">Pasajeros</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5 text-xs">
                  <Users className="h-3.5 w-3.5 text-purple-500" />Número de pasajeros *
                </Label>
                <Input type="number" min={1} max={20} value={passengers} onChange={(e) => setPassengers(parseInt(e.target.value) || 1)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Vehículo sugerido</Label>
                <div className={cn("flex items-center gap-2 rounded-lg px-3 h-9 text-xs font-medium border",
                  isMinivan ? "bg-amber-50 border-amber-200 text-amber-800" : "bg-blue-50 border-blue-200 text-blue-800")}>
                  <span>{isMinivan ? "🚐 Minivan" : "🚗 Auto estándar"}</span>
                  <span className="text-[10px] opacity-60 ml-auto">~{isMinivan ? EFF_MINIVAN : EFF_CAR} km/L</span>
                </div>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descripción (opcional)</Label>
              <Textarea
                placeholder={isMultiDay
                  ? "Maletas, niños, hoteles ya reservados, horarios preferidos..."
                  : "Equipaje, hora exacta, peticiones especiales..."}
                rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* ══════════════════════════════════════════════════════════════
            PRESUPUESTO ESTIMADO — diferente para express vs multi-día
        ══════════════════════════════════════════════════════════════ */}
        <Card className={cn("border-2 transition-all", costBreakdown ? "border-emerald-200" : "border-slate-100")}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calculator className="h-4 w-4 text-emerald-600" />
              Presupuesto estimado
              {calculating && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground ml-1" />}
              {costBreakdown && !calculating && (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-semibold px-1.5 py-0 ml-1">
                  <Sparkles className="h-2.5 w-2.5" />Auto
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-3">

            {/* Sin datos aún */}
            {validStops.length < 2 && !calculating && (
              <div className="flex items-center gap-2 rounded-lg bg-slate-50 border px-3 py-2.5 text-xs text-muted-foreground">
                <Calculator className="h-4 w-4 shrink-0" />
                Se calculará automáticamente cuando selecciones origen y destino.
              </div>
            )}

            {/* Vehículo */}
            {(validStops.length >= 2 || costBreakdown) && (
              <div className={cn("flex items-center gap-3 rounded-xl p-3",
                isMinivan ? "bg-amber-50" : "bg-blue-50")}>
                <span className="text-2xl">{isMinivan ? "🚐" : "🚗"}</span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{isMinivan ? "Minivan" : "Auto estándar"} recomendado</p>
                  <p className="text-xs text-muted-foreground">
                    {passengers} pax · ~{isMinivan ? EFF_MINIVAN : EFF_CAR} km/L · ${FUEL_PRICE}/L
                  </p>
                </div>
                {isMinivan && (
                  <span className="text-[10px] bg-amber-200 text-amber-800 rounded-full px-2 py-0.5 font-medium shrink-0">+3 pax</span>
                )}
              </div>
            )}

            {/* Loading */}
            {calculating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculando ruta y casetas…
              </div>
            )}

            {/* Desglose */}
            {costBreakdown && !calculating && (
              <div className="space-y-2">

                {/* ── Costos del viaje ──────────────────────────────── */}
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Costos del viaje</p>
                {[
                  { icon: Fuel,           label: `Gasolina · ${costBreakdown.distanceKm.toFixed(0)} km ÷ ${costBreakdown.efficiencyKmL} km/L`, value: costBreakdown.fuelCost,   color: "text-blue-600 bg-blue-50" },
                  { icon: Landmark,       label: "Casetas (según ruta)",                                                                          value: costBreakdown.tollsCost,  color: "text-amber-600 bg-amber-50" },
                  ...(isMultiDay ? [
                    { icon: BedDouble,      label: `Hotel conductor · ${Math.max(totalDays - 1, 0)} noches × $${HOTEL_NIGHT}`,                   value: costBreakdown.hotelCost,  color: "text-purple-600 bg-purple-50" },
                    { icon: UtensilsCrossed,label: `Viáticos conductor · ${totalDays} días × $${FOOD_DAY}`,                                      value: costBreakdown.foodCost,   color: "text-rose-600 bg-rose-50" },
                  ] : []),
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center shrink-0", color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-muted-foreground flex-1">{label}</span>
                    <span className="text-sm font-medium tabular-nums">{formatCurrency(value)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-sm pt-1">
                  <span className="text-muted-foreground">Subtotal costos</span>
                  <span className="font-medium">{formatCurrency(costBreakdown.costsSubtotal)}</span>
                </div>

                <Separator />

                {/* ── Salario conductor (multi-día) ─────────────────── */}
                {isMultiDay && (
                  <div className="space-y-3">
                    <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 space-y-3">
                      <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5">
                        <Banknote className="h-3.5 w-3.5" />
                        Análisis salarial — Chofer privado México 2025
                      </p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-emerald-700">
                        <div>
                          <p className="text-emerald-500">Salario mínimo diario</p>
                          <p className="font-semibold">${MIN_WAGE_DAILY}/día</p>
                        </div>
                        <div>
                          <p className="text-emerald-500">Multiplicador servicio calificado</p>
                          <p className="font-semibold">×{SALARY_MULTIPLIER}</p>
                        </div>
                        <div>
                          <p className="text-emerald-500">Tarifa exclusivo multi-día</p>
                          <p className="font-semibold">${driverDailyRate}/día</p>
                        </div>
                        <div>
                          <p className="text-emerald-500">Equivalente mensual (22 días)</p>
                          <p className="font-semibold">{formatCurrency(driverDailyRate * 22)}/mes</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-emerald-600">
                        Para conductor privado exclusivo multi-día. Tarifa de mercado: $800–1,200/día.
                        Puedes ajustar la tarifa si tienes referencia distinta.
                      </p>

                      {/* Ajuste de tarifa por el pasajero */}
                      <div className="flex items-center gap-3 pt-1">
                        <Label className="text-xs text-emerald-700 whitespace-nowrap">Tarifa diaria estimada:</Label>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">$</span>
                          <Input
                            type="number" min={0} step={50}
                            value={driverDailyRate}
                            onChange={(e) => setDriverDailyRate(parseFloat(e.target.value) || 0)}
                            className="h-7 w-24 text-xs font-semibold border-emerald-300 bg-white"
                          />
                          <span className="text-xs text-muted-foreground">/día</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50">
                        <Banknote className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-xs text-muted-foreground flex-1">
                        Salario conductor · {totalDays} días × ${driverDailyRate}
                      </span>
                      <span className="text-sm font-bold text-emerald-700 tabular-nums">
                        {formatCurrency(costBreakdown.salaryTotal)}
                      </span>
                    </div>
                  </div>
                )}

                {/* Express: ganancia % */}
                {isExpress && (
                  <div className="flex items-center gap-2.5">
                    <div className="h-7 w-7 rounded-lg flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50">
                      <TrendingUp className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-xs text-muted-foreground flex-1">Ganancia conductor (30%)</span>
                    <span className="text-sm font-medium tabular-nums">
                      {formatCurrency(costBreakdown.total - costBreakdown.costsSubtotal)}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="rounded-xl bg-slate-900 text-white p-4 space-y-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Total del viaje</span>
                    <span className="text-2xl font-bold">{formatCurrency(costBreakdown.total)}</span>
                  </div>
                  <Separator className="bg-white/10" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Por pasajero ({passengers} pax)</span>
                    <span className="text-xl font-bold text-emerald-400">{formatCurrency(costBreakdown.perPassenger)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-center text-muted-foreground">
                  Estimado · Magna ${FUEL_PRICE}/L
                  {isMultiDay ? ` · Hotel $${HOTEL_NIGHT}/noche · Viáticos $${FOOD_DAY}/día · Salario $${driverDailyRate}/día` : " · Ganancia conductor 30%"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Título y presupuesto ───────────────────────────────────── */}
        <Card>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">Título de la solicitud *</p>
              <Button variant="ghost" size="sm" className="text-xs h-7 gap-1 text-blue-600" onClick={autoTitle} disabled={!origin.city || !destination.city}>
                ✨ Generar
              </Button>
            </div>
            <Input
              placeholder={isMultiDay ? "ej: Viaje familiar 5 días Querétaro → Guanajuato" : "ej: Traslado Querétaro → AICM"}
              value={title} onChange={(e) => setTitle(e.target.value)} maxLength={100}
            />
            <p className="text-xs text-muted-foreground text-right">{title.length}/100</p>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5 text-xs">
                <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                Presupuesto máximo (MXN)
                {costBreakdown && <span className="text-muted-foreground font-normal">— calculado automáticamente, puedes ajustarlo</span>}
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">$</span>
                <Input type="number" min={0} placeholder="0" className="pl-7" value={budget} onChange={(e) => setBudget(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 flex gap-3">
          <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-xs text-blue-700">
            Tu solicitud será visible para conductores de la plataforma. Recibirás ofertas reales
            de cada conductor para que elijas al que más te convenga.
          </p>
        </div>

        <Button className="w-full" size="lg" onClick={handleSubmit} loading={submitting}>
          Publicar solicitud
        </Button>
      </div>
    </div>
  );
}
