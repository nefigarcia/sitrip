import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatShortDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
  }).format(d);
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function tripStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    DRAFT: "Borrador",
    PUBLISHED: "Publicado",
    IN_PROGRESS: "En curso",
    COMPLETED: "Completado",
    CANCELLED: "Cancelado",
  };
  return labels[status] ?? status;
}

export function bookingStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    PENDING: "Pendiente",
    CONFIRMED: "Confirmado",
    CANCELLED: "Cancelado",
    COMPLETED: "Completado",
  };
  return labels[status] ?? status;
}

export function requestStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    OPEN: "Abierto",
    ACCEPTED: "Aceptado",
    CANCELLED: "Cancelado",
    COMPLETED: "Completado",
  };
  return labels[status] ?? status;
}

export function expenseTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    FUEL: "Gasolina",
    TOLL: "Caseta",
    FOOD: "Comida",
    HOTEL: "Hotel",
    PARKING: "Estacionamiento",
    MAINTENANCE: "Mantenimiento",
    OTHER: "Otro",
  };
  return labels[type] ?? type;
}

export function fuelTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    GASOLINE: "Gasolina",
    DIESEL: "Diesel",
    HYBRID: "Híbrido",
    ELECTRIC: "Eléctrico",
  };
  return labels[type] ?? type;
}
