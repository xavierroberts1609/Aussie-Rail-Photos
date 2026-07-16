/**
 * Starting set of major Australian rail operators, for immediate dropdown usefulness.
 * Not exhaustive — new operators typed in via "Other" are saved and become pickable
 * for every upload after that.
 */
export const SEED_OPERATORS = {
  Passenger: [
    "Sydney Trains",
    "NSW TrainLink",
    "Metro Trains Melbourne",
    "V/Line",
    "Queensland Rail",
    "Transperth",
    "Transwa",
    "Adelaide Metro",
    "Canberra Metro",
    "Journey Beyond",
  ],
  Freight: [
    "Aurizon",
    "Pacific National",
    "Qube Logistics",
    "SCT Logistics",
    "One Rail Australia",
    "Genesee & Wyoming Australia",
    "Southern Shorthaul Railroad (SSR)",
    "Watco Australia",
    "TasRail",
    "BHP Iron Ore",
    "Rio Tinto Iron Ore",
    "Fortescue Metals Group (FMG)",
    "Roy Hill",
    "El Zorro",
  ],
  "Track / Infrastructure": [
    "Australian Rail Track Corporation (ARTC)",
    "Arc Infrastructure",
  ],
} as const;

export const ALL_SEED_OPERATORS: string[] = Object.values(SEED_OPERATORS).flat();
