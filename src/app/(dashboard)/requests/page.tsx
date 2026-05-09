import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { RequestCard } from "@/components/requests/request-card";
import { ExploreTrips } from "@/components/trips/explore-trips";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Plus, Car, Search } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const session = await getSession();
  const userId  = session!.user.id;

  const [openRequests, myRequests] = await Promise.all([
    prisma.tripRequest.findMany({
      where: { status: "OPEN", passengerId: { not: userId } },
      orderBy: { createdAt: "desc" },
      include: {
        passenger: { select: { name: true, avatar: true } },
        _count: { select: { offers: true } },
      },
    }),
    prisma.tripRequest.findMany({
      where: { passengerId: userId },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { offers: true } } },
    }),
  ]);

  return (
    <div>
      <TopBar
        title="Solicitudes y Viajes"
        subtitle="Busca viajes disponibles o publica una solicitud"
      />

      <div className="p-4 lg:p-6 animate-fade-in">
        <div className="flex justify-end mb-4">
          <Button asChild>
            <Link href="/requests/new">
              <Plus className="h-4 w-4" />
              Nueva solicitud
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="explore">
          <TabsList className="mb-4 w-full sm:w-auto">
            <TabsTrigger value="explore" className="flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Explorar viajes
            </TabsTrigger>
            <TabsTrigger value="open" className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              Solicitudes ({openRequests.length})
            </TabsTrigger>
            <TabsTrigger value="mine" className="flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5" />
              Mis solicitudes ({myRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* ── Explorar viajes publicados por conductores ─────────── */}
          <TabsContent value="explore">
            <ExploreTrips userId={userId} />
          </TabsContent>

          {/* ── Solicitudes abiertas de pasajeros ─────────────────── */}
          <TabsContent value="open">
            {openRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-20 w-20 rounded-2xl bg-purple-50 flex items-center justify-center mb-4">
                  <MapPin className="h-10 w-10 text-purple-300" />
                </div>
                <h2 className="text-xl font-semibold mb-2">No hay solicitudes abiertas</h2>
                <p className="text-muted-foreground max-w-sm text-sm">
                  Los pasajeros que buscan conductor privado aparecerán aquí.
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {openRequests.map((req) => (
                  <RequestCard key={req.id} request={req as any} showPassenger />
                ))}
              </div>
            )}
          </TabsContent>

          {/* ── Mis solicitudes ────────────────────────────────────── */}
          <TabsContent value="mine">
            {myRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <p className="text-muted-foreground text-sm mb-4">Aún no has publicado solicitudes</p>
                <Button asChild size="sm">
                  <Link href="/requests/new">Publicar solicitud</Link>
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {myRequests.map((req) => (
                  <RequestCard key={req.id} request={req as any} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
