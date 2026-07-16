export const ROLES = { USER: "USER", ADMIN: "ADMIN" } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export const PHOTO_STATUS = { PENDING: "PENDING", APPROVED: "APPROVED" } as const;
export type PhotoStatus = (typeof PHOTO_STATUS)[keyof typeof PHOTO_STATUS];
