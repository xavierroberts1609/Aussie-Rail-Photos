export const PAGE_SIZES = {
  mobile: 20,
  tablet: 30,
  desktop: 50,
} as const;

const VALID_PAGE_SIZES: number[] = Object.values(PAGE_SIZES);
const DEFAULT_PAGE_SIZE: number = PAGE_SIZES.desktop;

export function pageSizeForWidth(width: number): number {
  if (width >= 1024) return PAGE_SIZES.desktop;
  if (width >= 640) return PAGE_SIZES.tablet;
  return PAGE_SIZES.mobile;
}

export function parsePageSize(value: string | undefined): number {
  const n = Number(value);
  return VALID_PAGE_SIZES.includes(n) ? n : DEFAULT_PAGE_SIZE;
}

export function parsePage(value: string | undefined): number {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : 1;
}
