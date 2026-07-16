export const CATEGORIES = [
  "Electric",
  "Diesel",
  "Heritage",
  "Metros",
  "Trams",
  "Stations",
  "Infrastructure",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];
