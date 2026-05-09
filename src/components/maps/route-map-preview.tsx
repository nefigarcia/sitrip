"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Loader2, AlertCircle, Navigation } from "lucide-react";
import type { StopInput } from "@/types";

interface RouteOption {
  index: number;
  summary: string;
  durationText: string;
  durationSeconds: number;
  distanceText: string;
  distanceMeters: number;
  hasTolls: boolean;
  legs: { durationSeconds: number; distanceMeters: number }[];
}

interface Props {
  stops: StopInput[];
  onRouteSelect: (legs: { durationMinutes: number; distanceKm: number }[]) => void;
}

export function RouteMapPreview({ stops, onRouteSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const validStops = stops.filter((s) => s.lat && s.lng);
  const stopsKey = validStops.map((s) => `${s.lat},${s.lng}`).join("|");

  useEffect(() => {
    if (!mapRef.current || !(window as any).google || validStops.length < 2) return;
    const google = (window as any).google;

    // Init map once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 7,
        center: { lat: 19.4326, lng: -99.1332 },
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
      });
    }

    // Init renderer
    if (!rendererRef.current) {
      rendererRef.current = new google.maps.DirectionsRenderer({
        map: mapInstanceRef.current,
        suppressMarkers: false,
        polylineOptions: { strokeColor: "#2563eb", strokeWeight: 5 },
      });
    }

    const origin = { lat: validStops[0].lat!, lng: validStops[0].lng! };
    const destination = {
      lat: validStops[validStops.length - 1].lat!,
      lng: validStops[validStops.length - 1].lng!,
    };
    const waypoints = validStops.slice(1, -1).map((s) => ({
      location: { lat: s.lat!, lng: s.lng! },
      stopover: true,
    }));

    setLoading(true);
    setError(false);
    setRoutes([]);
    setSelectedIdx(0);

    new google.maps.DirectionsService().route(
      {
        origin,
        destination,
        waypoints,
        travelMode: google.maps.TravelMode.DRIVING,
        // Solo disponible sin waypoints intermedios
        provideRouteAlternatives: waypoints.length === 0,
        region: "mx",
      },
      (result: any, status: string) => {
        setLoading(false);
        if (status !== "OK" || !result) { setError(true); return; }

        rendererRef.current.setDirections(result);

        const parsed: RouteOption[] = result.routes.map((route: any, i: number) => {
          const legs = route.legs.map((leg: any) => ({
            durationSeconds: leg.duration.value,
            distanceMeters: leg.distance.value,
          }));
          const totalDuration = legs.reduce((s: number, l: any) => s + l.durationSeconds, 0);
          const totalDistance = legs.reduce((s: number, l: any) => s + l.distanceMeters, 0);
          const hasTolls = (route.warnings ?? []).some((w: string) =>
            w.toLowerCase().includes("toll") || w.toLowerCase().includes("caseta") || w.toLowerCase().includes("peaje")
          );

          const fmt = (sec: number) => {
            const h = Math.floor(sec / 3600);
            const m = Math.round((sec % 3600) / 60);
            return h > 0 ? `${h}h ${m}min` : `${m} min`;
          };
          const fmtKm = (m: number) => `${(m / 1000).toFixed(1)} km`;

          return {
            index: i,
            summary: route.summary || `Ruta ${i + 1}`,
            durationText: fmt(totalDuration),
            durationSeconds: totalDuration,
            distanceText: fmtKm(totalDistance),
            distanceMeters: totalDistance,
            hasTolls,
            legs,
          };
        });

        setRoutes(parsed);

        // Emitir la primera ruta automáticamente
        if (parsed.length > 0) {
          onRouteSelect(
            parsed[0].legs.map((l) => ({
              durationMinutes: Math.round(l.durationSeconds / 60),
              distanceKm: l.distanceMeters / 1000,
            }))
          );
        }
      }
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stopsKey]);

  const handleSelect = (route: RouteOption) => {
    setSelectedIdx(route.index);
    rendererRef.current?.setRouteIndex(route.index);
    onRouteSelect(
      route.legs.map((l) => ({
        durationMinutes: Math.round(l.durationSeconds / 60),
        distanceKm: l.distanceMeters / 1000,
      }))
    );
  };

  if (validStops.length < 2) return null;

  return (
    <div className="rounded-xl border overflow-hidden bg-white">
      {/* Route alternatives — solo aparecen si hay más de una opción */}
      {routes.length > 1 && (
        <div className="border-b">
          <p className="text-xs font-medium text-muted-foreground px-3 pt-3 pb-2">
            Selecciona la ruta que usarás
          </p>
          <div className="divide-y">
            {routes.map((route) => (
              <button
                key={route.index}
                onClick={() => handleSelect(route)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors",
                  selectedIdx === route.index
                    ? "bg-blue-50 border-l-2 border-l-blue-600"
                    : "hover:bg-slate-50 border-l-2 border-l-transparent"
                )}
              >
                <Navigation className={cn("h-4 w-4 shrink-0", selectedIdx === route.index ? "text-blue-600" : "text-muted-foreground")} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{route.summary}</p>
                  {route.hasTolls && (
                    <p className="text-xs text-amber-600">🚧 Esta ruta tiene casetas</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className={cn("font-bold text-sm", selectedIdx === route.index ? "text-blue-700" : "text-slate-700")}>
                    {route.durationText}
                  </p>
                  <p className="text-xs text-muted-foreground">{route.distanceText}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Single route info */}
      {routes.length === 1 && (
        <div className="flex items-center gap-3 px-3 py-2.5 border-b bg-blue-50">
          <Navigation className="h-4 w-4 text-blue-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{routes[0].summary}</p>
            {routes[0].hasTolls && <p className="text-xs text-amber-600">🚧 Esta ruta tiene casetas</p>}
          </div>
          <div className="text-right shrink-0">
            <p className="font-bold text-sm text-blue-700">{routes[0].durationText}</p>
            <p className="text-xs text-muted-foreground">{routes[0].distanceText}</p>
          </div>
        </div>
      )}

      {/* Loading / error */}
      {loading && (
        <div className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground border-b">
          <Loader2 className="h-4 w-4 animate-spin" />
          Calculando ruta…
        </div>
      )}
      {error && !loading && (
        <div className="flex items-center gap-2 px-3 py-2.5 text-xs text-amber-700 bg-amber-50 border-b">
          <AlertCircle className="h-4 w-4 shrink-0" />
          No se pudo calcular la ruta. Verifica las ubicaciones.
        </div>
      )}

      {/* Map */}
      <div ref={mapRef} className="h-72 w-full" />
    </div>
  );
}
