import Link from "next/link";
import { Route } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-col bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-12">
        <Link href="/" className="flex items-center gap-2 mb-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <Route className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl">SiTrip</span>
        </Link>

        <div className="my-auto">
          <blockquote className="text-2xl font-semibold leading-snug mb-6 text-balance">
            "Antes no sabía cuánto cobrar por las casetas. Ahora tengo todo claro y mis clientes confían más en mí."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500/30 flex items-center justify-center font-bold text-blue-300">
              R
            </div>
            <div>
              <p className="font-medium">Roberto García</p>
              <p className="text-sm text-slate-400">Conductor privado, Querétaro</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-slate-500">© 2025 SiTrip. Hecho en México 🇲🇽</p>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary">
              <Route className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg">SiTrip</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
