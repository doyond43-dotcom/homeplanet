export type HomePlanetAccessRole =
  | "public"
  | "owner"
  | "staff"
  | "customer"
  | "admin_support";

export type HomePlanetAccessScope =
  | "public:view"
  | "board:view_private"
  | "board:manage"
  | "staff:update_status"
  | "staff:add_proof"
  | "customer:view_own"
  | "admin:support_view"
  | "admin:support_fix";

export type HomePlanetScopedKey = {
  id: string;
  boardId: string;
  role: HomePlanetAccessRole;
  scopes: HomePlanetAccessScope[];
  presenceIdentityId?: string;
  customerId?: string;
  staffId?: string;
  issuedByOwnerId?: string;
  expiresAt?: string;
  createdAt: string;
};

export type HomePlanetAccessDecision = {
  allowed: boolean;
  role: HomePlanetAccessRole;
  reason: string;
};

export const PUBLIC_ONLY_ACCESS: HomePlanetScopedKey = {
  id: "public-default",
  boardId: "public",
  role: "public",
  scopes: ["public:view"],
  createdAt: new Date().toISOString(),
};

export function hasScope(
  key: HomePlanetScopedKey | null | undefined,
  scope: HomePlanetAccessScope
): boolean {
  if (!key) return false;

  if (key.expiresAt && new Date(key.expiresAt).getTime() < Date.now()) {
    return false;
  }

  return key.scopes.includes(scope);
}

export function canViewPrivateBoard(
  key: HomePlanetScopedKey | null | undefined,
  boardId: string
): HomePlanetAccessDecision {
  if (!key) {
    return {
      allowed: false,
      role: "public",
      reason: "No scoped Presence key found. Public view only.",
    };
  }

  if (key.boardId !== boardId) {
    return {
      allowed: false,
      role: key.role,
      reason: "Scoped key does not belong to this board.",
    };
  }

  if (key.expiresAt && new Date(key.expiresAt).getTime() < Date.now()) {
    return {
      allowed: false,
      role: key.role,
      reason: "Scoped key expired.",
    };
  }

  if (key.role === "owner" && hasScope(key, "board:view_private")) {
    return {
      allowed: true,
      role: "owner",
      reason: "Owner Presence key allows private board access.",
    };
  }

  if (key.role === "admin_support" && hasScope(key, "admin:support_view")) {
    return {
      allowed: true,
      role: "admin_support",
      reason: "Temporary owner-approved support key allows limited private view.",
    };
  }

  return {
    allowed: false,
    role: key.role,
    reason: "This key does not allow private board access.",
  };
}

export function canStaffUpdateStatus(
  key: HomePlanetScopedKey | null | undefined,
  boardId: string
): HomePlanetAccessDecision {
  if (!key || key.boardId !== boardId) {
    return {
      allowed: false,
      role: key?.role ?? "public",
      reason: "No valid staff key for this board.",
    };
  }

  if (key.role === "owner" || hasScope(key, "staff:update_status")) {
    return {
      allowed: true,
      role: key.role,
      reason: "Scoped key allows status updates.",
    };
  }

  return {
    allowed: false,
    role: key.role,
    reason: "This key cannot update job status.",
  };
}

export function canCustomerViewRecord(
  key: HomePlanetScopedKey | null | undefined,
  boardId: string,
  customerId: string
): HomePlanetAccessDecision {
  if (!key || key.boardId !== boardId) {
    return {
      allowed: false,
      role: key?.role ?? "public",
      reason: "No valid customer key for this board.",
    };
  }

  if (key.role === "owner") {
    return {
      allowed: true,
      role: "owner",
      reason: "Owner can view customer record.",
    };
  }

  if (
    key.role === "customer" &&
    key.customerId === customerId &&
    hasScope(key, "customer:view_own")
  ) {
    return {
      allowed: true,
      role: "customer",
      reason: "Customer scoped key allows view-only access to own record.",
    };
  }

  return {
    allowed: false,
    role: key.role,
    reason: "Customer key does not match this record.",
  };
}

export function redactPrivateBoardData<T extends Record<string, any>>(
  record: T,
  privateFields: string[]
): Partial<T> {
  const safeRecord = { ...record };

  for (const field of privateFields) {
    if (field in safeRecord) {
      delete safeRecord[field];
    }
  }

  return safeRecord;
}
