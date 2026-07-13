import { SidebarItem } from "@/components/admin/sidebar-items";

/**
 * Minimal shape we need from the current-user profile for access checks.
 */
export interface AccessContext {
  roles?: string[] | null;
  permissions?: string[] | null;
}

// Roles that always have full access regardless of granted permissions.
const SUPER_ROLES = ["chairman"];
const SUPER_PERMISSIONS = ["full_system_control"];

// Gate permission that allows entering the admin panel.
export const ADMIN_GATE = "admin_access";

// Legacy roles that should always be allowed into the admin panel, even before
// the admin_access permission has been granted to them.
const LEGACY_ADMIN_ROLES = ["chairman", "admin"];

/**
 * Does the user hold at least one `access_*` page permission?
 * These are granted (directly or via a role) for each admin page they may see.
 */
export function hasAnyPageAccess(ctx?: AccessContext | null): boolean {
  return (ctx?.permissions ?? []).some((p) => p.startsWith("access_"));
}

/**
 * May this user enter the admin panel at all (the "door")?
 * True if they:
 *  - have full access (super role / `full_system_control`), or
 *  - hold the explicit `admin_access` gate, or
 *  - have been granted any `access_*` page permission (directly or via a role) —
 *    if a role grants them at least one admin page, they must be able to reach
 *    it, or
 *  - are a legacy admin/chairman (backward compatible before the gate is seeded).
 */
export function canAccessAdmin(ctx?: AccessContext | null): boolean {
  if (!ctx) return false;
  if (hasFullAccess(ctx)) return true;
  const roles = ctx.roles ?? [];
  const perms = ctx.permissions ?? [];
  return (
    perms.includes(ADMIN_GATE) ||
    hasAnyPageAccess(ctx) ||
    roles.some((r) => LEGACY_ADMIN_ROLES.includes(r))
  );
}

/**
 * Whether the user effectively has access to everything.
 */
export function hasFullAccess(ctx?: AccessContext | null): boolean {
  if (!ctx) return false;
  const roles = ctx.roles ?? [];
  const perms = ctx.permissions ?? [];
  return (
    roles.some((r) => SUPER_ROLES.includes(r)) ||
    perms.some((p) => SUPER_PERMISSIONS.includes(p))
  );
}

/**
 * Does the user have a specific page-access permission?
 */
export function canAccess(
  ctx: AccessContext | null | undefined,
  permission?: string,
): boolean {
  if (!permission) return true; // ungated item
  if (hasFullAccess(ctx)) return true;
  return (ctx?.permissions ?? []).includes(permission);
}

/**
 * Filter sidebar items by the user's page-access permissions.
 *
 * Fail-open behaviour (so the panel is never accidentally empty):
 *  - While the profile is still loading (`ctx` is undefined) → show everything.
 *  - Super roles / full_system_control → show everything.
 *  - A user explicitly gated with `admin_access` is filtered strictly to the
 *    `access_*` menus they were granted (no fail-open).
 *  - A user with neither `admin_access` nor any `access_*` permission is
 *    treated as a legacy account (predates the page-access system) → show all.
 *  - Otherwise show only the items they are granted.
 */
export function filterSidebarByPermissions<T extends SidebarItem>(
  items: T[],
  ctx?: AccessContext | null,
): T[] {
  if (ctx === undefined) return items; // not loaded yet
  if (hasFullAccess(ctx)) return items;

  const perms = ctx?.permissions ?? [];
  const isGatedAdmin = perms.includes(ADMIN_GATE);

  // Legacy fail-open: only when the user is not an explicitly gated admin and
  // has no page-access permissions at all.
  if (!isGatedAdmin && !hasAnyPageAccess(ctx)) return items;

  return items.filter((item) => canAccess(ctx, item.permission));
}
