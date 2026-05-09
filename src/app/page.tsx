import Link from "next/link";
import {
  Route, Car, Calculator, MapPin, Shield, Clock,
  ChevronRight, CheckCircle, Star, ArrowRight,
  Users, TrendingUp, Fuel, Landmark,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Calculator,
    title: "Calculadora de gastos",
    description: "Calcula automáticamente gasolina, casetas y extras. Obtén el precio justo por pasajero con un solo click.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: Landmark,
    title: "Casetas automáticas",
    description: "Integramos Google Routes API para obtener el costo de casetas en tiempo real entre cada tramo de tu ruta.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: MapPin,
    title: "Rutas multi-destino",
    description: "Crea viajes con múltiples paradas y días. Perfecto para recorridos de negocios o turismo privado.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Users,
    title: "Conecta con pasajeros",
    description: "Publica tus viajes o responde solicitudes de pasajeros que necesitan conductor privado.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Shield,
    title: "Profesionaliza tu servicio",
    description: "Genera presupuestos claros y detallados que puedes compartir con tus clientes antes del viaje.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: TrendingUp,
    title: "Controla tus ganancias",
    description: "Define tu margen de ganancia y visualiza exactamente cuánto ganarás en cada viaje.",
    color: "bg-cyan-50 text-cyan-600",
  },
];

const steps = [
  {
    num: "01",
    title: "Registra tu vehículo",
    desc: "Agrega tu auto con su rendimiento de gasolina. La app calculará los costos automáticamente.",
  },
  {
    num: "02",
    title: "Crea tu ruta",
    desc: "Añade las ciudades de origen, destinos intermedios y fecha de regreso. Nosotros calculamos las distancias.",
  },
  {
    num: "03",
    title: "Revisa el desglose",
    desc: "Ve el costo de gasolina, casetas y extras. Ajusta tu margen de ganancia y obtén el precio final.",
  },
  {
    num: "04",
    title: "Publica y cobra",
    desc: "Comparte el viaje con tus clientes o publícalo en la plataforma. Gestiona reservas fácilmente.",
  },
];

const testimonials = [
  {
    name: "Roberto García",
    city: "Querétaro",
    text: "Antes perdía dinero porque no calculaba bien las casetas. Ahora sé exactamente cuánto cobrar y mis clientes confían más en mí.",
    stars: 5,
  },
  {
    name: "María López",
    city: "Guadalajara",
    text: "Encontré un conductor confiable para llevarme a CDMX con escala en León. Todo muy claro desde el presupuesto.",
    stars: 5,
  },
  {
    name: "Carlos Mendoza",
    city: "Monterrey",
    text: "Como conductor de Uber, ahora tengo mis viajes privados más organizados. La calculadora me ahorra mucho tiempo.",
    stars: 5,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Route className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900">SiTrip</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Registrarse gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-6 border border-white/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Para conductores privados en México
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-balance">
              Viajes privados,{" "}
              <span className="text-blue-400">sin perder dinero</span> en el intento
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-2xl mx-auto text-balance">
              Calcula gastos de gasolina y casetas automáticamente, genera presupuestos
              profesionales y conecta con más clientes. Todo en un solo lugar.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="xl" asChild className="bg-blue-500 hover:bg-blue-400 text-white border-0 shadow-lg shadow-blue-500/25">
                <Link href="/register">
                  Empezar gratis
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="xl" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                <Link href="/login">Ya tengo cuenta</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
              {[
                { value: "100%", label: "Gratis para empezar" },
                { value: "≈3 min", label: "Para crear un viaje" },
                { value: "MXN", label: "Todo en pesos" },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{s.value}</div>
                  <div className="text-xs text-slate-400 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1440 40 1080 0 720 0C360 0 0 40 0 40L0 80Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 lg:py-28" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Todo lo que necesitas para crecer
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Herramientas diseñadas específicamente para conductores privados en México
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${f.color} mb-4`}>
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-slate-900 text-lg mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-slate-50" id="how">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-slate-500 text-lg">De conductor a negocio en 4 pasos</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-blue-200 to-transparent -translate-y-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white font-bold text-lg mb-4 shadow-lg shadow-primary/25">
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Lo que dicen los conductores
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl border p-6 flex flex-col gap-4">
                <div className="flex gap-1">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed flex-1">"{t.text}"</p>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            ¿Listo para profesionalizar tus viajes?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Únete a conductores que ya usan SiTrip para cobrar lo justo y conseguir más clientes.
          </p>
          <Button size="xl" asChild className="bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-xl">
            <Link href="/register">
              Crear cuenta gratis
              <ChevronRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Route className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-slate-700">SiTrip</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 SiTrip. Hecho en México 🇲🇽
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-foreground">Iniciar sesión</Link>
            <Link href="/register" className="hover:text-foreground">Registrarse</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
