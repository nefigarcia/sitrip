"use client";
import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaceResult {
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
}

interface PlacesInputProps {
  value: string;
  placeholder?: string;
  className?: string;
  iconColor?: string;
  onPlaceSelect: (place: PlaceResult) => void;
  onChange?: (value: string) => void;
}

export function PlacesInput({
  value, placeholder = "Buscar lugar…", className,
  iconColor = "text-muted-foreground", onPlaceSelect, onChange,
}: PlacesInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);
  const onSelectRef = useRef(onPlaceSelect);

  useEffect(() => { onSelectRef.current = onPlaceSelect; });

  useEffect(() => {
    const tryInit = () => {
      if (!inputRef.current || !(window as any).google) return false;
      const google = (window as any).google;

      autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
        componentRestrictions: { country: "mx" },
        fields: ["geometry", "formatted_address", "address_components", "name"],
      });

      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (!place?.geometry) return;

        const comps = place.address_components ?? [];
        const locality =
          comps.find((c: any) => c.types.includes("locality"))?.long_name ||
          comps.find((c: any) => c.types.includes("sublocality_level_1"))?.long_name ||
          comps.find((c: any) => c.types.includes("administrative_area_level_2"))?.long_name || "";
        const state =
          comps.find((c: any) => c.types.includes("administrative_area_level_1"))?.long_name || "";
        const isNamed = place.name && !locality.toLowerCase().includes(place.name.toLowerCase());
        const city = isNamed ? place.name! : locality || place.name || "";

        onSelectRef.current({
          name: place.name ?? "",
          address: place.formatted_address ?? "",
          city, state,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
      });
      return true;
    };

    if (!tryInit()) {
      const interval = setInterval(() => { if (tryInit()) clearInterval(interval); }, 400);
      return () => clearInterval(interval);
    }
    return () => {
      if (autocompleteRef.current) {
        (window as any).google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="relative">
      <MapPin className={cn("absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 pointer-events-none", iconColor)} />
      <input
        ref={inputRef}
        defaultValue={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          "flex h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          className
        )}
      />
    </div>
  );
}
