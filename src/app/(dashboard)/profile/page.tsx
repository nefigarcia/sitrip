import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TopBar } from "@/components/layout/top-bar";
import { ProfileForm } from "@/components/profile/profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSession();
  const user = await prisma.user.findUnique({
    where: { id: session!.user.id },
    include: { vehicle: true },
  });

  return (
    <div>
      <TopBar title="Mi Perfil" subtitle="Gestiona tu información personal y vehículo" />
      <div className="p-4 lg:p-6 max-w-2xl mx-auto animate-fade-in">
        <ProfileForm user={user as any} />
      </div>
    </div>
  );
}
