import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | SiTrip",
    default: "SiTrip — Viajes Privados con Conductor",
  },
  description:
    "Plataforma para conductores privados y pasajeros. Calcula gastos, gestiona rutas multi-destino y conecta con clientes de forma profesional.",
  keywords: ["viajes privados", "conductor privado", "México", "presupuesto viaje", "casetas"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
        <Script
          id="google-maps"
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places&loading=async`}
          strategy="afterInteractive"
        />
        <Analytics />
      </body>
    </html>
  );
}
