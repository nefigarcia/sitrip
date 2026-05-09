"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search, MapPin, ArrowRight, Users, Calendar,
  Car, Zap, CalendarDays, X, SlidersHorizontal,
  Phone, Star, Fuel, Loader2, Route,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatDate, formatShortDate, getInitials, fuelTypeLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Stop       { city: string; state: string; order: number; arrivalDate?: string; departureDate?: string }
interface Driver     { name: string; avatar: string | null; phone: string | null; vehicle: { brand: string; model: string; year: number; capacity: number; fuelType: string } | null }
interface PublicTrip {
  id: string; title: string; tripType: string; status: string;
  startDate: string; endDate: string;
  totalDistance: number | null; pricePerPassenger: number | null;
  maxPassengers: number; currentPassengers: number;
  isPublic: boolean; stops: Stop[];
  driver: Driver; _count: { bookings: number };
}

// ── Places autocomplete para buscar origen ───────────────────────────────────
function OriginSearch({ onSearch }: {
  onSearch: (city: string, lat: number | null, lng: number | null) => void;
}) {
  const inputRef   = useRef<HTMLInputElement>(null);
  const acRef      = useRef<any>(null);
  const onSearchRef = useRef(onSearch);
  const [value, setValue] = useState("");

  useEffect(() => { onSearchRef.current = onSearch; });

  useEffect(() => {
    const tryInit = () => {
      if (!inputRef.current || !(window as any).google) return false;
      const google = (window as any).google;
      acRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "mx" },
        fields: ["geometry", "address_components", "name"],
        types: [],
      });
      acRef.current.addListener("place_changed", () => {
        const place = acRef.current.getPlace();
        if (!place?.geometry) return;
        const comps  = place.address_components ?? [];
        const city   =
          comps.find((c: any) => c.types.includes("locality"))?.long_name ||
          comps.find((c: any) => c.types.includes("sublocality_level_1"))?.long_name ||
          place.name || "";
        const display = city || place.name || "";
        setValue(display);
        onSearchRef.current(display, place.geometry.location.lat(), place.geometry.location.lng());
      });
      return true;
    };
    if (!tryInit()) {
      const t = setInterval(() => { if (tryInit()) clearInterval(t); }, 400);
      return () => clearInterval(t);
    }
    return () => {
      if (acRef.current) (window as any).google?.maps?.event?.clearInstanceListeners(acRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const clear = () => {
    setValue("");
    if (inputRef.current) inputRef.current.value = "";
    onSearch("", null, null);
  };

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <input
        ref={inputRef}
        defaultValue=""
        placeholder="Buscar por ciudad de origen…"
        onChange={(e) => setValue(e.target.value)}
        className="flex h-10 w-full rounded-xl border border-input bg-background pl-9 pr-9 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {value && (
        <button onClick={clear} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

// ── Tarjeta de viaje público ──────────────────────────────────────────────────
function TripCard({ trip, userId }: { trip: PublicTrip; userId: string }) {
  const router = useRouter();
  const [booking, setBooking] = useState(false);
  const stops    = [...trip.stops].sort((a, b) => a.order - b.order);
  const origin   = stops[0];
  const dest     = stops[stops.length - 1];
  const midStops = stops.slice(1, -1);
  const spotsLeft = trip.maxPassengers - trip.currentPassengers;
  const isMultiDay = trip.tripType === "MULTI_DAY";

  const handleBook = async (e: React.MouseEvent) => {
    e.preventDefault();
    setBooking(true);
    const res = await fetch(`/api/trips/${trip.id}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passengers: 1 }),
    });
    if (res.ok) {
      toast.success("¡Solicitud enviada! El conductor te confirmará.");
      router.refresh();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Error al reservar");
    }
    setBooking(false);
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 overflow-hidden">
      <CardContent className="p-0">
        {/* Encabezado con tipo */}
        <div className={cn(
          "px-4 py-2.5 flex items-center gap-2 text-xs font-medium",
          isMultiDay ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
        )}>
          {isMultiDay ? <CalendarDays className="h-3.5 w-3.5" /> : <Zap className="h-3.5 w-3.5" />}
          {isMultiDay ? "Privado Multi-día" : "Traslado Express"}
          <span className="ml-auto text-muted-foreground font-normal">{formatShortDate(trip.startDate)}</span>
        </div>

        <div className="p-4 space-y-4">
          {/* Ruta */}
          <div>
            <h3 className="font-semibold text-sm mb-2 line-clamp-1">{trip.title}</h3>
            <div className="relative pl-4 border-l-2 border-dashed border-slate-200 space-y-1.5">
              <div className="relative flex items-center gap-2">
                <div className="absolute -left-[17px] h-3 w-3 rounded-full bg-emerald-500 border-2 border-white" />
                <span className="text-xs font-medium">{origin?.city}</span>
                {origin?.state && <span className="text-xs text-muted-foreground">{origin.state}</span>}
              </div>

              {midStops.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <div className="absolute -left-[13px] h-2 w-2 rounded-full bg-blue-300 border-2 border-white ml-0.5" />
                  <Route className="h-3 w-3 ml-1" />
                  {midStops.length} parada{midStops.length !== 1 ? "s" : ""} intermedias
                  <span className="text-muted-foreground/60">
                    ({midStops.map((s) => s.city).join(", ")})
                  </span>
                </div>
              )}

              <div className="relative flex items-center gap-2">
                <div className="absolute -left-[17px] h-3 w-3 rounded-full bg-rose-500 border-2 border-white" />
                <span className="text-xs font-medium">{dest?.city}</span>
                {dest?.state && <span className="text-xs text-muted-foreground">{dest.state}</span>}
              </div>
            </div>
          </div>

          {/* Info del conductor */}
          <div className="flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarImage src={trip.driver.avatar ?? ""} />
              <AvatarFallback className="text-xs">{getInitials(trip.driver.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{trip.driver.name}</p>
              {trip.driver.vehicle && (
                <p className="text-[10px] text-muted-foreground truncate">
                  {trip.driver.vehicle.brand} {trip.driver.vehicle.model} {trip.driver.vehicle.year}
                  {" · "}{fuelTypeLabel(trip.driver.vehicle.fuelType)}
                </p>
              )}
            </div>
            {trip.driver.vehicle && (
              <div className="text-[10px] text-muted-foreground text-right shrink-0">
                <p>{trip.driver.vehicle.capacity} pax max</p>
              </div>
            )}
          </div>

          {/* Stats + precio */}
          <div className="flex items-center justify-between">
            <div className="flex gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {spotsLeft > 0 ? `${spotsLeft} lugar${spotsLeft !== 1 ? "es" : ""}` : "Sin lugares"}
              </span>
              {trip.totalDistance && (
                <span className="flex items-center gap-1">
                  <Route className="h-3.5 w-3.5" />
                  {trip.totalDistance.toFixed(0)} km
                </span>
              )}
            </div>
            {trip.pricePerPassenger && (
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground">por persona</p>
                <p className="text-base font-bold text-emerald-600">{formatCurrency(trip.pricePerPassenger)}</p>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex gap-2 pt-1">
            <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
              <Link href={`/trips/${trip.id}`}>Ver detalles</Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs"
              disabled={spotsLeft <= 0 || booking}
              onClick={handleBook}
            >
              {booking ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {spotsLeft <= 0 ? "Sin lugares" : "Reservar"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export function ExploreTrips({ userId }: { userId: string }) {
  const [trips, setTrips]       = useState<PublicTrip[]>([]);
  const [loading, setLoading]   = useState(true);
  const [originCity, setOriginCity] = useState("");
  const [originLat, setOriginLat]   = useState<number | null>(null);
  const [originLng, setOriginLng]   = useState<number | null>(null);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [searched, setSearched] = useState(false);

  const fetchTrips = async (city: string, lat: number | null, lng: number | null, type: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city)   params.set("origin", city);
      if (lat)    params.set("originLat", String(lat));
      if (lng)    params.set("originLng", String(lng));
      if (type !== "ALL") params.set("tripType", type);
      const res = await fetch(`/api/trips/public?${params}`);
      if (res.ok) setTrips(await res.json());
    } catch {}
    finally { setLoading(false); }
  };

  // Carga inicial (todos los viajes)
  useEffect(() => { fetchTrips("", null, null, "ALL"); }, []);

  const handleSearch = (city: string, lat: number | null, lng: number | null) => {
    setOriginCity(city); setOriginLat(lat); setOriginLng(lng);
    setSearched(!!city);
    fetchTrips(city, lat, lng, typeFilter);
  };

  const handleTypeChange = (type: string) => {
    setTypeFilter(type);
    fetchTrips(originCity, originLat, originLng, type);
  };

  return (
    <div className="space-y-4">
      {/* Buscador */}
      <div className="flex gap-2">
        <OriginSearch onSearch={handleSearch} />
        <Select value={typeFilter} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-44 h-10 rounded-xl">
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Todos los tipos</SelectItem>
            <SelectItem value="EXPRESS">
              <span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-blue-500" />Express</span>
            </SelectItem>
            <SelectItem value="MULTI_DAY">
              <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-emerald-500" />Multi-día</span>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resultados */}
      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm">Buscando viajes…</span>
        </div>
      ) : trips.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <Car className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="font-semibold text-slate-700 mb-1">
            {searched ? `Sin viajes desde ${originCity}` : "No hay viajes disponibles"}
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            {searched
              ? "Intenta con otra ciudad o publica una solicitud para que los conductores te encuentren."
              : "Los conductores publicarán viajes pronto. También puedes publicar una solicitud."}
          </p>
          <Button size="sm" asChild className="mt-4">
            <a href="/requests/new">Publicar solicitud de viaje</a>
          </Button>
        </div>
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            {searched
              ? `${trips.length} viaje${trips.length !== 1 ? "s" : ""} disponible${trips.length !== 1 ? "s" : ""} desde ${originCity}`
              : `${trips.length} viaje${trips.length !== 1 ? "s" : ""} disponible${trips.length !== 1 ? "s" : ""}`}
          </p>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} userId={userId} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
