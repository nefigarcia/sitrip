"use client";
import { useEffect, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Trash2, ArrowDown, AlertCircle, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RouteMapPreview } from "@/components/maps/route-map-preview";
import type { TripDraft } from "../new-trip-form";
import type { StopInput } from "@/types";

interface Props {
  draft: TripDraft;
  update: (d: Partial<TripDraft>) => void;
}

const STOP_COLORS = [
  "bg-emerald-500", "bg-blue-500", "bg-purple-500",
  "bg-amber-500", "bg-rose-500", "bg-cyan-500",
];

// Formatea como LOCAL time (no UTC) para usar en datetime-local inputs
function addMinutes(base: string, minutes: number): string {
  if (!base || !minutes) return "";
  const d = new Date(base);
  d.setMinutes(d.getMinutes() + Math.round(minutes));
  const pad = (n: number) => String(n).padStart(2, "0");
  // getFullYear/Month/Date/Hours/Minutes usan hora LOCAL, no UTC
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function recalculateArrivals(stops: StopInput[]): StopInput[] {
  const result = stops.map((s) => ({ ...s }));
  for (let i = 1; i < result.length; i++) {
    const prev = result[i - 1];
    if (prev.departureDate && prev.durationToNext) {
      result[i] = {
        ...result[i],
        arrivalDate: addMinutes(prev.departureDate, prev.durationToNext),
      };
    }
  }
  return result;
}

// ── PlacesInput ──────────────────────────────────────────────────────────────
function PlacesInput({ value, placeholder, onPlaceSelect, index }: {
  value: string;
  placeholder: string;
  onPlaceSelect: (place: {
    name: string; address: string; city: string;
    state: string; lat: number; lng: number;
  }) => void;
  index: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const onPlaceSelectRef = useRef(onPlaceSelect);

  useEffect(() => { onPlaceSelectRef.current = onPlaceSelect; });

  useEffect(() => {
    if (!inputRef.current || typeof window === "undefined" || !(window as any).google) return;

    const google = (window as any).google;
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "mx" },
      fields: ["geometry", "formatted_address", "address_components", "name"],
    });

    autocompleteRef.current.addListener("place_changed", () => {
      const place = autocompleteRef.current.getPlace();
      if (!place?.geometry) return;

      const components = place.address_components ?? [];
      const locality =
        components.find((c: any) => c.types.includes("locality"))?.long_name ||
        components.find((c: any) => c.types.includes("sublocality_level_1"))?.long_name ||
        components.find((c: any) => c.types.includes("administrative_area_level_2"))?.long_name || "";
      const state =
        components.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name || "";
      const isNamedPlace = place.name && !locality.toLowerCase().includes(place.name.toLowerCase());
      const city = isNamedPlace ? place.name! : locality || place.name || "";

      onPlaceSelectRef.current({
        name: place.name ?? "",
        address: place.formatted_address ?? "",
        city,
        state,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      });
    });

    return () => {
      if (autocompleteRef.current) {
        (window as any).google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const colorClass = STOP_COLORS[index % STOP_COLORS.length].replace("bg-", "text-");

  return (
    <div className="relative">
      <MapPin className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0", colorClass)} />
      <input
        ref={inputRef}
        defaultValue={value}
        placeholder={placeholder}
        className="flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}

// ── StopRow ──────────────────────────────────────────────────────────────────
function StopRow({ stop, index, total, onChange, onRemove, loadingArrival }: {
  stop: StopInput;
  index: number;
  total: number;
  onChange: (updated: StopInput) => void;
  onRemove: () => void;
  loadingArrival: boolean;
}) {
  const isFirst = index === 0;
  const isLast = index === total - 1;
  const label = isFirst ? "Origen" : isLast ? "Destino final" : `Parada ${index}`;
  const hasAutoArrival = !isFirst && !!stop.arrivalDate && !!stop.durationToNext;

  return (
    <div className="rounded-xl border bg-white p-4 space-y-3">
      <div className="flex items-center gap-2">
        <div className={cn(
          "h-6 w-6 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0",
          STOP_COLORS[index % STOP_COLORS.length]
        )}>
          {index + 1}
        </div>
        <span className="text-sm font-medium">{label}</span>
        {stop.durationToNext && (
          <span className="text-xs text-muted-foreground">
            ~{formatDuration(stop.durationToNext)} al siguiente
          </span>
        )}
        {!isFirst && !isLast && (
          <Button
            variant="ghost" size="icon"
            className="ml-auto h-7 w-7 text-muted-foreground hover:text-destructive"
            onClick={onRemove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      <PlacesInput
        value={stop.city}
        placeholder={`Ciudad o lugar de ${label.toLowerCase()}`}
        onPlaceSelect={(place) => onChange({ ...stop, ...place })}
        index={index}
      />

      <div className="grid grid-cols-2 gap-3">
        {isFirst && (
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <Label className="text-xs">Fecha y hora de salida</Label>
            <Input
              type="datetime-local"
              value={stop.departureDate}
              onChange={(e) => onChange({ ...stop, departureDate: e.target.value })}
              className="text-xs"
            />
          </div>
        )}

        {!isFirst && !isLast && (
          <>
            <div className="space-y-1">
              <Label className="text-xs flex items-center gap-1.5">
                Llegada
                {loadingArrival
                  ? <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                  : hasAutoArrival && (
                    <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0">
                      <Sparkles className="h-2.5 w-2.5" />Auto
                    </Badge>
                  )}
              </Label>
              <Input
                type="datetime-local"
                value={stop.arrivalDate}
                onChange={(e) => onChange({ ...stop, arrivalDate: e.target.value })}
                className={cn("text-xs", hasAutoArrival && "border-emerald-300 bg-emerald-50/50")}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Salida de esta parada</Label>
              <Input
                type="datetime-local"
                value={stop.departureDate}
                onChange={(e) => onChange({ ...stop, departureDate: e.target.value })}
                className="text-xs"
              />
            </div>
          </>
        )}

        {isLast && (
          <div className="space-y-1 col-span-2 sm:col-span-1">
            <Label className="text-xs flex items-center gap-1.5">
              Fecha y hora de llegada
              {loadingArrival
                ? <Loader2 className="h-3 w-3 animate-spin text-muted-foreground" />
                : hasAutoArrival && (
                  <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0">
                    <Sparkles className="h-2.5 w-2.5" />Auto
                  </Badge>
                )}
            </Label>
            <Input
              type="datetime-local"
              value={stop.arrivalDate}
              onChange={(e) => onChange({ ...stop, arrivalDate: e.target.value })}
              className={cn("text-xs", hasAutoArrival && "border-emerald-300 bg-emerald-50/50")}
            />
            {hasAutoArrival && (
              <p className="text-[10px] text-emerald-600">
                Calculado según la ruta seleccionada. Puedes ajustarlo manualmente.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Notas de esta parada (opcional)</Label>
        <Input
          placeholder="ej: Parada de 2 horas para reunión"
          value={stop.notes}
          onChange={(e) => onChange({ ...stop, notes: e.target.value })}
          className="text-xs"
        />
      </div>
    </div>
  );
}

// ── Step2Route ───────────────────────────────────────────────────────────────
export function Step2Route({ draft, update }: Props) {
  const [mapsLoaded, setMapsLoaded] = useState(
    typeof window !== "undefined" && !!(window as any).google
  );
  const [loadingSegments, setLoadingSegments] = useState<Set<number>>(new Set());
  const stopsRef = useRef(draft.stops);
  stopsRef.current = draft.stops;

  useEffect(() => {
    if ((window as any).google) { setMapsLoaded(true); return; }
    const check = setInterval(() => {
      if ((window as any).google) { setMapsLoaded(true); clearInterval(check); }
    }, 500);
    return () => clearInterval(check);
  }, []);

  const updateStop = async (i: number, stop: StopInput) => {
    let stops = stopsRef.current.map((s, idx) => (idx === i ? stop : s));
    const prev = stopsRef.current[i];
    const coordsChanged = stop.lat && stop.lng && (stop.lat !== prev.lat || stop.lng !== prev.lng);

    if (coordsChanged) {
      // Fetch duración server-side para este segmento (para casetas)
      if (i > 0) stops = await fetchSegmentDuration(stops, i - 1);
      if (i < stops.length - 1) stops = await fetchSegmentDuration(stops, i);
    } else {
      stops = recalculateArrivals(stops);
    }

    update({ stops });
  };

  const fetchSegmentDuration = async (stops: StopInput[], fromIdx: number): Promise<StopInput[]> => {
    const from = stops[fromIdx];
    const to = stops[fromIdx + 1];
    if (!from?.lat || !from?.lng || !to?.lat || !to?.lng) return stops;

    setLoadingSegments((prev) => new Set(prev).add(fromIdx + 1));
    try {
      const res = await fetch(
        `/api/maps/route?fromLat=${from.lat}&fromLng=${from.lng}&toLat=${to.lat}&toLng=${to.lng}`
      );
      if (res.ok) {
        const data = await res.json();
        const updated = stops.map((s, i) =>
          i === fromIdx
            ? { ...s, durationToNext: data.durationMinutes, distanceToNext: data.distanceKm, tollToNext: data.tollMXN }
            : s
        );
        return recalculateArrivals(updated);
      }
    } catch {}
    finally {
      setLoadingSegments((prev) => {
        const s = new Set(prev);
        s.delete(fromIdx + 1);
        return s;
      });
    }
    return stops;
  };

  // Cuando el usuario selecciona una ruta en el mapa, actualizamos duraciones y distancias
  const handleRouteSelect = (legs: { durationMinutes: number; distanceKm: number }[]) => {
    const stops = stopsRef.current.map((s) => ({ ...s }));
    // Cada leg corresponde a un segmento entre paradas consecutivas
    legs.forEach((leg, i) => {
      if (i < stops.length - 1) {
        stops[i] = {
          ...stops[i],
          durationToNext: leg.durationMinutes,
          distanceToNext: leg.distanceKm,
        };
      }
    });
    update({ stops: recalculateArrivals(stops) });
  };

  const addStop = () => {
    const blank: StopInput = {
      name: "", address: "", city: "", state: "",
      lat: null, lng: null, arrivalDate: "", departureDate: "", notes: "",
    };
    const stops = [...stopsRef.current];
    stops.splice(stops.length - 1, 0, blank);
    update({ stops });
  };

  const removeStop = (i: number) => {
    update({ stops: stopsRef.current.filter((_, idx) => idx !== i) });
  };

  const validStops = draft.stops.filter((s) => s.lat && s.lng);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Ruta y paradas</h2>
        <p className="text-sm text-muted-foreground">
          Agrega el origen, las paradas y el destino. Las horas de llegada se calculan solas.
        </p>
      </div>

      {!mapsLoaded && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-xs text-amber-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          Cargando Google Maps… verifica tu API Key si no aparece el autocompletado.
        </div>
      )}

      {/* Stop cards */}
      <div className="space-y-2">
        {draft.stops.map((stop, i) => (
          <div key={i}>
            <StopRow
              stop={stop}
              index={i}
              total={draft.stops.length}
              onChange={(s) => updateStop(i, s)}
              onRemove={() => removeStop(i)}
              loadingArrival={loadingSegments.has(i)}
            />
            {i < draft.stops.length - 1 && (
              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full border-dashed"
        onClick={addStop}
        disabled={draft.stops.length >= 8}
      >
        <Plus className="h-4 w-4" />
        Agregar parada intermedia
      </Button>

      {/* Mapa con opciones de ruta — aparece cuando hay 2+ paradas con coordenadas */}
      {validStops.length >= 2 && mapsLoaded && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Vista de ruta
          </p>
          <RouteMapPreview
            stops={draft.stops}
            onRouteSelect={handleRouteSelect}
          />
        </div>
      )}
    </div>
  );
}
