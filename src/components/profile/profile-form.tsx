"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Phone, FileText, Car, Fuel, Gauge, Users, Save, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { getInitials, fuelTypeLabel } from "@/lib/utils";
import { BRANDS, getModels, getYears, getFuelEfficiency } from "@/data/vehicles";

const profileSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  bio: z.string().optional(),
});

const vehicleSchema = z.object({
  brand: z.string().min(1, "Selecciona una marca"),
  model: z.string().min(1, "Selecciona un modelo"),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  licensePlate: z.string().optional(),
  fuelEfficiency: z.number().min(1, "Mínimo 1 km/L"),
  fuelType: z.enum(["GASOLINE", "DIESEL", "HYBRID", "ELECTRIC"]),
  capacity: z.number().min(1).max(20),
});

type ProfileData = z.infer<typeof profileSchema>;
type VehicleData = z.infer<typeof vehicleSchema>;

const FUEL_TYPES = ["GASOLINE", "DIESEL", "HYBRID", "ELECTRIC"] as const;

export function ProfileForm({ user }: { user: any }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [savingVehicle, setSavingVehicle] = useState(false);
  const [efficiencyAutoFilled, setEfficiencyAutoFilled] = useState(false);

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      bio: user?.bio ?? "",
    },
  });

  const vehicleForm = useForm<VehicleData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      brand: user?.vehicle?.brand ?? "",
      model: user?.vehicle?.model ?? "",
      year: user?.vehicle?.year ?? new Date().getFullYear(),
      color: user?.vehicle?.color ?? "",
      licensePlate: user?.vehicle?.licensePlate ?? "",
      fuelEfficiency: user?.vehicle?.fuelEfficiency ?? 12,
      fuelType: user?.vehicle?.fuelType ?? "GASOLINE",
      capacity: user?.vehicle?.capacity ?? 4,
    },
  });

  const selectedBrand = vehicleForm.watch("brand");
  const selectedModel = vehicleForm.watch("model");
  const selectedYear = vehicleForm.watch("year");
  const fuelEfficiency = vehicleForm.watch("fuelEfficiency");

  const availableModels = getModels(selectedBrand);
  const availableYears = getYears(selectedBrand, selectedModel);

  const handleBrandChange = (brand: string) => {
    vehicleForm.setValue("brand", brand);
    vehicleForm.setValue("model", "");
    vehicleForm.setValue("year", new Date().getFullYear());
    setEfficiencyAutoFilled(false);
  };

  const handleModelChange = (model: string) => {
    vehicleForm.setValue("model", model);
    const years = getYears(selectedBrand, model);
    const latestYear = years[0] ?? new Date().getFullYear();
    vehicleForm.setValue("year", latestYear);
    tryAutoFillEfficiency(selectedBrand, model, latestYear);
  };

  const handleYearChange = (year: number) => {
    vehicleForm.setValue("year", year);
    tryAutoFillEfficiency(selectedBrand, selectedModel, year);
  };

  const tryAutoFillEfficiency = (brand: string, model: string, year: number) => {
    const eff = getFuelEfficiency(brand, model, year);
    if (eff !== null && eff > 0) {
      vehicleForm.setValue("fuelEfficiency", eff);
      setEfficiencyAutoFilled(true);
    } else {
      setEfficiencyAutoFilled(false);
    }
  };

  const onProfileSave = async (data: ProfileData) => {
    setSaving(true);
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success("Perfil actualizado");
      router.refresh();
    } else toast.error("Error al actualizar perfil");
    setSaving(false);
  };

  const onVehicleSave = async (data: VehicleData) => {
    setSavingVehicle(true);
    const res = await fetch("/api/vehicle", {
      method: user?.vehicle ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      toast.success(user?.vehicle ? "Vehículo actualizado" : "Vehículo registrado");
      router.refresh();
    } else toast.error("Error al guardar vehículo");
    setSavingVehicle(false);
  };

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-xl font-bold">{getInitials(user?.name ?? "U")}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-lg">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          <p className="text-xs text-muted-foreground capitalize">
            {user?.role === "BOTH" ? "Conductor y Pasajero" : user?.role === "DRIVER" ? "Conductor" : "Pasajero"}
          </p>
        </div>
      </div>

      {/* Profile form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4" />
            Información personal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={profileForm.handleSubmit(onProfileSave)} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" {...profileForm.register("name")} />
              </div>
              {profileForm.formState.errors.name && (
                <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input className="pl-9" type="tel" placeholder="+52 442 000 0000" {...profileForm.register("phone")} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                Descripción (visible para pasajeros)
              </Label>
              <Textarea
                placeholder="Cuéntanos sobre ti, tu experiencia, vehículo, especialidades..."
                rows={3}
                {...profileForm.register("bio")}
              />
            </div>

            <Button type="submit" loading={saving} className="gap-2">
              <Save className="h-4 w-4" />
              Guardar perfil
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Vehicle form */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Car className="h-4 w-4" />
            Mi vehículo
            {!user?.vehicle && (
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full ml-2">
                ⚠ Necesario para calcular gastos
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={vehicleForm.handleSubmit(onVehicleSave)} className="space-y-4">

            {/* Cascading selects */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Brand */}
              <div className="space-y-1.5">
                <Label>Marca *</Label>
                <Select value={selectedBrand} onValueChange={handleBrandChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona marca" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {BRANDS.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {vehicleForm.formState.errors.brand && (
                  <p className="text-xs text-destructive">{vehicleForm.formState.errors.brand.message}</p>
                )}
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <Label>Modelo *</Label>
                <Select
                  value={selectedModel}
                  onValueChange={handleModelChange}
                  disabled={!selectedBrand}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedBrand ? "Selecciona modelo" : "Primero elige marca"} />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {availableModels.map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {vehicleForm.formState.errors.model && (
                  <p className="text-xs text-destructive">{vehicleForm.formState.errors.model.message}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-1.5">
                <Label>Año *</Label>
                <Select
                  value={String(selectedYear)}
                  onValueChange={(v) => handleYearChange(Number(v))}
                  disabled={!selectedModel || availableYears.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Año" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {availableYears.length > 0
                      ? availableYears.map((y) => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))
                      : [new Date().getFullYear(), new Date().getFullYear() - 1, new Date().getFullYear() - 2].map((y) => (
                          <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                        ))
                    }
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Color & plates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Color</Label>
                <Input placeholder="Blanco" {...vehicleForm.register("color")} />
              </div>
              <div className="space-y-1.5">
                <Label>Placas</Label>
                <Input placeholder="ABC-123" {...vehicleForm.register("licensePlate")} />
              </div>
            </div>

            <Separator />

            {/* Fuel efficiency — auto-filled */}
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1.5 col-span-1">
                <Label className="flex items-center gap-1.5">
                  <Gauge className="h-3.5 w-3.5 text-blue-500" />
                  Rendimiento
                  {efficiencyAutoFilled && (
                    <Badge variant="success" className="gap-1 text-[10px] px-1.5 py-0">
                      <Sparkles className="h-2.5 w-2.5" />
                      Auto
                    </Badge>
                  )}
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={1}
                    step={0.5}
                    {...vehicleForm.register("fuelEfficiency", { valueAsNumber: true })}
                    onChange={(e) => {
                      vehicleForm.setValue("fuelEfficiency", parseFloat(e.target.value) || 1);
                      setEfficiencyAutoFilled(false);
                    }}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">km/L</span>
                </div>
                {vehicleForm.formState.errors.fuelEfficiency && (
                  <p className="text-xs text-destructive">{vehicleForm.formState.errors.fuelEfficiency.message}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Fuel className="h-3.5 w-3.5 text-amber-500" />
                  Combustible
                </Label>
                <Select
                  value={vehicleForm.watch("fuelType")}
                  onValueChange={(v) => vehicleForm.setValue("fuelType", v as any)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FUEL_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{fuelTypeLabel(t)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-purple-500" />
                  Capacidad
                </Label>
                <div className="flex items-center gap-1.5">
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    {...vehicleForm.register("capacity", { valueAsNumber: true })}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">pax</span>
                </div>
              </div>
            </div>

            {/* Efficiency info */}
            {efficiencyAutoFilled ? (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs text-emerald-700">
                  <span className="font-semibold">Rendimiento obtenido automáticamente</span> del {selectedBrand} {selectedModel} {selectedYear}: <strong>{fuelEfficiency} km/L</strong>.
                  Puedes ajustarlo si tu auto tiene condiciones diferentes (desgaste, carga, etc.).
                </div>
              </div>
            ) : (
              <div className="rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 text-xs text-blue-700">
                El rendimiento (km/L) determina cuánta gasolina gasta tu auto. Selecciona marca, modelo y año
                y lo calculamos automáticamente. Puedes corregirlo si lo sabes con exactitud.
              </div>
            )}

            <Button type="submit" loading={savingVehicle} className="gap-2">
              <Save className="h-4 w-4" />
              {user?.vehicle ? "Actualizar vehículo" : "Registrar vehículo"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
