export type TravelStyle = "Luxury" | "Budget" | "Backpacking" | "Family" | "Solo" | "Couple";

export interface TripInput {
  from: string;
  destination: string;
  budget: number;
  currency: string;
  travelers: number;
  startDate: string;
  endDate: string;
  days: number;
  style: TravelStyle;
  interests: string[];
  accommodation: string;
  transport: string;
  notes: string;
}

export interface SavedTrip {
  id: string;
  createdAt: number;
  input: TripInput;
  itinerary: string;
}

export const INTEREST_OPTIONS = [
  "Beaches","Mountains","Adventure","Nature","Food","Shopping",
  "History","Nightlife","Photography","Wildlife","Culture",
];

export const STYLE_OPTIONS: TravelStyle[] = ["Luxury","Budget","Backpacking","Family","Solo","Couple"];
export const ACCOMMODATION_OPTIONS = ["Hotel","Hostel","Resort","Airbnb"];
export const TRANSPORT_OPTIONS = ["Flight","Train","Bus","Car"];
export const CURRENCY_OPTIONS = ["USD","EUR","GBP","INR","JPY","AUD","CAD"];