export const STATES = [
  { code: "NSW", label: "New South Wales" },
  { code: "VIC", label: "Victoria" },
  { code: "QLD", label: "Queensland" },
  { code: "WA", label: "Western Australia" },
  { code: "SA", label: "South Australia" },
  { code: "TAS", label: "Tasmania" },
  { code: "ACT", label: "Australian Capital Territory" },
  { code: "NT", label: "Northern Territory" },
] as const;

export type StateCode = (typeof STATES)[number]["code"];

export function stateLabel(code: string): string {
  return STATES.find((s) => s.code === code)?.label ?? code;
}

/**
 * Starting set of major-network stations per state, for immediate dropdown usefulness.
 * Not exhaustive — new stations typed in via "Other" are saved and become pickable
 * for every upload after that, so the list grows to cover what's actually used.
 */
export const SEED_STATIONS: Record<StateCode, string[]> = {
  NSW: [
    "Central", "Town Hall", "Wynyard", "Circular Quay", "Museum", "St James",
    "Redfern", "Strathfield", "Parramatta", "Blacktown", "Penrith", "Richmond",
    "Hornsby", "Chatswood", "North Sydney", "Bondi Junction", "Sydenham",
    "Sutherland", "Cronulla", "Campbelltown", "Liverpool", "Cabramatta",
    "Fairfield", "Granville", "Lidcombe", "Epping", "Gordon", "Turramurra",
    "Berowra", "Gosford", "Newcastle Interchange", "Wollongong", "Kiama",
    "Bomaderry", "Goulburn", "Dubbo", "Orange", "Bathurst", "Armidale",
    "Casino", "Grafton", "Coffs Harbour", "Taree", "Wagga Wagga", "Albury",
    "Broken Hill",
  ],
  VIC: [
    "Flinders Street", "Southern Cross", "Melbourne Central", "Flagstaff",
    "Parliament", "North Melbourne", "Richmond", "South Yarra", "Camberwell",
    "Box Hill", "Ringwood", "Lilydale", "Belgrave", "Dandenong", "Pakenham",
    "Cranbourne", "Frankston", "Mordialloc", "Werribee", "Williamstown",
    "Sunshine", "Sunbury", "St Albans", "Craigieburn", "Broadmeadows",
    "Essendon", "Footscray", "Newport", "Altona", "Laverton", "Geelong",
    "South Geelong", "Waurn Ponds", "Marshall", "Ballarat", "Bacchus Marsh",
    "Melton", "Bendigo", "Kyneton", "Castlemaine", "Woodend", "Seymour",
    "Wodonga", "Wangaratta", "Benalla", "Shepparton", "Traralgon", "Morwell",
    "Moe", "Warragul", "Bairnsdale", "Sale", "Kensington", "Sunbury Station",
  ],
  QLD: [
    "Central", "Roma Street", "Fortitude Valley", "South Bank", "South Brisbane",
    "Bowen Hills", "Northgate", "Nundah", "Toombul", "Ipswich",
    "Springfield Central", "Beenleigh", "Varsity Lakes", "Robina", "Nerang",
    "Helensvale", "Caboolture", "Gympie North", "Nambour", "Rockhampton",
    "Mackay", "Townsville", "Bundaberg", "Maryborough West", "Roma",
    "Charleville", "Longreach", "Cloncurry", "Mount Isa",
  ],
  WA: [
    "Perth", "Perth Underground", "Elizabeth Quay", "Claisebrook", "Fremantle",
    "Midland", "Armadale", "Thornlie", "Mandurah", "Rockingham", "Warnbro",
    "Butler", "Clarkson", "Joondalup", "Currambine", "Whitfords", "Warwick",
    "Greenwood", "Stirling", "Glendalough", "Subiaco", "City West",
    "West Leederville", "Cottesloe", "Victoria Park", "Burswood", "Belmont",
  ],
  SA: [
    "Adelaide", "North Adelaide", "Woodville", "Port Adelaide", "Outer Harbor",
    "Gawler", "Salisbury", "Elizabeth", "Mawson Lakes", "Tonsley", "Marion",
    "Flinders", "Noarlunga Centre", "Seaford", "Belair", "Blackwood",
    "Coromandel", "Grange",
  ],
  TAS: [],
  ACT: ["Gungahlin Place", "Dickson", "Elouera Street", "City"],
  NT: ["Darwin", "Katherine", "Alice Springs"],
};

export const NO_STATION_LABEL = "No nearby station / not applicable";

export function formatLocationLine(photo: {
  station?: string | null;
  suburb?: string | null;
  state?: string | null;
}): string {
  return [
    photo.station ? `${photo.station} Station` : null,
    photo.suburb,
    photo.state,
  ]
    .filter(Boolean)
    .join(", ");
}
