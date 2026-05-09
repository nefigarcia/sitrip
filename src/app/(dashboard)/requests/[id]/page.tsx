import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { RequestDetailView } from "@/components/requests/request-detail";

export const dynamic = "force-dynamic";

export default async function RequestDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  const request = await prisma.tripRequest.findUnique({
    where: { id: params.id },
    include: {
      passenger: { select: { name: true, email: true, phone: true, avatar: true } },
      offers: {
        include: {
          driver: { select: { name: true, email: true, phone: true, avatar: true, vehicle: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!request) notFound();

  const isOwner = request.passengerId === session!.user.id;
  const hasOffer = request.offers.some((o) => o.driverId === session!.user.id);

  return (
    <div>
      <TopBar title={request.title} subtitle={isOwner ? "Tu solicitud" : "Solicitud de pasajero"} />
      <div className="p-4 lg:p-6 max-w-3xl mx-auto animate-fade-in">
        <RequestDetailView request={request as any} isOwner={isOwner} hasOffer={hasOffer} userId={session!.user.id} />
      </div>
    </div>
  );
}
