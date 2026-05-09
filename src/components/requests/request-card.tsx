import Link from "next/link";
import { MapPin, ArrowRight, MessageSquare, Zap, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatCurrency, formatShortDate, requestStatusLabel, getInitials } from "@/lib/utils";

const statusColors: Record<string, "success" | "info" | "warning" | "destructive" | "secondary"> = {
  OPEN: "success",
  ACCEPTED: "info",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
};

interface RequestCardProps {
  request: {
    id: string;
    title: string;
    tripType?: string | null;
    origin: string;
    destination: string;
    startDate: Date;
    endDate?: Date | null;
    totalDays?: number | null;
    passengers: number;
    budget?: number | null;
    status: string;
    description?: string | null;
    passenger?: { name: string; avatar?: string | null };
    _count: { offers: number };
  };
  showPassenger?: boolean;
}

export function RequestCard({ request, showPassenger }: RequestCardProps) {
  return (
    <Link href={`/requests/${request.id}`}>
      <Card className="hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant={statusColors[request.status] ?? "secondary"}>
                {requestStatusLabel(request.status)}
              </Badge>
              {request.tripType === "MULTI_DAY" ? (
                <Badge variant="success" className="gap-1">
                  <CalendarDays className="h-3 w-3" />
                  {request.totalDays ? `${request.totalDays} días` : "Multi-día"}
                </Badge>
              ) : (
                <Badge variant="info" className="gap-1">
                  <Zap className="h-3 w-3" />
                  Express
                </Badge>
              )}
            </div>
            {request._count.offers > 0 && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <MessageSquare className="h-3.5 w-3.5" />
                {request._count.offers}
              </div>
            )}
          </div>

          <h3 className="font-semibold text-slate-900 mb-3 line-clamp-2 leading-snug">{request.title}</h3>

          <div className="flex items-center gap-1.5 mb-3 text-xs">
            <MapPin className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            <span className="truncate font-medium">{request.origin}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
            <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
            <span className="truncate font-medium">{request.destination}</span>
          </div>

          {request.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{request.description}</p>
          )}

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Fecha</span>
              <span className="text-xs font-medium">{formatShortDate(request.startDate)}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Pasajeros</span>
              <span className="text-xs font-medium">{request.passengers}</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-xs text-muted-foreground">Presupuesto</span>
              <span className="text-xs font-medium text-emerald-600">
                {request.budget ? formatCurrency(request.budget) : "Abierto"}
              </span>
            </div>
          </div>

          {showPassenger && request.passenger && (
            <div className="mt-3 pt-3 border-t flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={request.passenger.avatar ?? ""} />
                <AvatarFallback className="text-xs">{getInitials(request.passenger.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">{request.passenger.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
