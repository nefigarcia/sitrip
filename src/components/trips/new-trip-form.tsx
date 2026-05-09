"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { StopInput, ExtraExpense } from "@/types";
import { Step1BasicInfo } from "./steps/step1-basic-info";
import { Step2Route } from "./steps/step2-route";
import { Step3Expenses } from "./steps/step3-expenses";
import { Step4Review } from "./steps/step4-review";

export interface TripDraft {
  tripType: "EXPRESS" | "MULTI_DAY";
  title: string;
  description: string;
  maxPassengers: number;
  stops: StopInput[];
  fuelPrice: number;
  profitMargin: number;
  driverDailyRate: number;
  extraExpenses: ExtraExpense[];
  notes: string;
}

const STEPS = [
  { num: 1, label: "Información básica" },
  { num: 2, label: "Ruta y paradas" },
  { num: 3, label: "Gastos" },
  { num: 4, label: "Revisar y publicar" },
];

const defaultDraft: TripDraft = {
  tripType: "EXPRESS",
  title: "",
  description: "",
  maxPassengers: 1,
  stops: [
    { name: "", address: "", city: "", state: "", lat: null, lng: null, arrivalDate: "", departureDate: "", notes: "" },
    { name: "", address: "", city: "", state: "", lat: null, lng: null, arrivalDate: "", departureDate: "", notes: "" },
  ],
  fuelPrice: 23.5,
  profitMargin: 20,
  driverDailyRate: 900,
  extraExpenses: [],
  notes: "",
};

interface NewTripFormProps {
  vehicle: { fuelEfficiency: number; capacity: number } | null;
}

export function NewTripForm({ vehicle }: NewTripFormProps) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [draft, setDraft] = useState<TripDraft>(defaultDraft);
  const [loading, setLoading] = useState(false);

  const update = (data: Partial<TripDraft>) => setDraft((d) => ({ ...d, ...data }));

  const handleSubmit = async (publish: boolean) => {
    setLoading(true);
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, driverDailyRate: draft.driverDailyRate, publish }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast.error(err.error ?? "Error al crear el viaje");
        return;
      }
      const { id } = await res.json();
      toast.success(publish ? "¡Viaje publicado exitosamente!" : "Viaje guardado como borrador");
      router.push(`/trips/${id}`);
    } catch {
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold shrink-0 transition-all",
                  step > s.num
                    ? "bg-primary text-white"
                    : step === s.num
                    ? "bg-primary text-white ring-4 ring-primary/20"
                    : "bg-slate-100 text-slate-400"
                )}
              >
                {step > s.num ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              <div className="ml-2 hidden sm:block">
                <p
                  className={cn(
                    "text-xs font-medium",
                    step === s.num ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {s.label}
                </p>
              </div>
              {i < STEPS.length - 1 && (
                <div className={cn("flex-1 h-px mx-3", step > s.num ? "bg-primary" : "bg-slate-200")} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="animate-fade-in">
        {step === 1 && <Step1BasicInfo draft={draft} update={update} />}
        {step === 2 && <Step2Route draft={draft} update={update} />}
        {step === 3 && (
          <Step3Expenses
            draft={draft}
            update={update}
            vehicleEfficiency={vehicle?.fuelEfficiency ?? null}
          />
        )}
        {step === 4 && (
          <Step4Review
            draft={draft}
            vehicleEfficiency={vehicle?.fuelEfficiency ?? null}
            onSubmit={handleSubmit}
            loading={loading}
          />
        )}
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="flex justify-between mt-8 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Anterior
          </Button>
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canProceed(step, draft)}>
            Siguiente
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

function canProceed(step: number, draft: TripDraft): boolean {
  if (step === 1) return draft.title.trim().length >= 3 && draft.maxPassengers >= 1;
  if (step === 2) {
    const validStops = draft.stops.filter((s) => s.city.trim().length > 0);
    return validStops.length >= 2;
  }
  return true;
}
