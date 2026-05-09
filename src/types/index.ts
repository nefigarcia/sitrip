import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string;
      phone?: string;
    };
  }
}

export type TripType = "EXPRESS" | "MULTI_DAY";

export type TripStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";
export type BookingStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";
export type RequestStatus = "OPEN" | "ACCEPTED" | "CANCELLED" | "COMPLETED";
export type ExpenseType =
  | "FUEL"
  | "TOLL"
  | "FOOD"
  | "HOTEL"
  | "PARKING"
  | "MAINTENANCE"
  | "OTHER";
export type FuelType = "GASOLINE" | "DIESEL" | "HYBRID" | "ELECTRIC";
export type UserRole = "DRIVER" | "PASSENGER" | "BOTH";
export type OfferStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface StopInput {
  name: string;
  address: string;
  city: string;
  state: string;
  lat: number | null;
  lng: number | null;
  arrivalDate: string;
  departureDate: string;
  notes: string;
  distanceToNext?: number;
  durationToNext?: number;
  tollToNext?: number | null;
}

export interface ExtraExpense {
  type: ExpenseType;
  description: string;
  amount: number;
}

export interface TripFormData {
  title: string;
  description: string;
  maxPassengers: number;
  startDate: string;
  endDate: string;
  stops: StopInput[];
  fuelPrice: number;
  profitMargin: number;
  extraExpenses: ExtraExpense[];
  notes: string;
}

export interface TripSummary {
  totalDistanceKm: number;
  totalFuelMXN: number;
  totalTollsMXN: number;
  totalExtrasMXN: number;
  subtotal: number;
  profitAmount: number;
  total: number;
  pricePerPassenger: number;
}
