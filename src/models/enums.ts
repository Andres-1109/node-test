export const USER_ROLES = ['administrator', 'requestManager'] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SUPPLY_REQUEST_STATUSES = ['pending', 'approved', 'rejected', 'completed'] as const;
export type SupplyRequestStatus = (typeof SUPPLY_REQUEST_STATUSES)[number];
