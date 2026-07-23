export type UserRole = "admin" | "user";

const ROLE_KEY = "sigma_role";

export function setStoredRole(role: UserRole) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ROLE_KEY, role);
}

export function getStoredRole(): UserRole {
  if (typeof window === "undefined") return "admin";
  const stored = window.localStorage.getItem(ROLE_KEY);
  return stored === "user" ? "user" : "admin";
}

export function clearStoredRole() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ROLE_KEY);
}
