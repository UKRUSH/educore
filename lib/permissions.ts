// Role-based access helpers: student | admin | lecturer

import type { Role } from "@prisma/client";

export function isAdmin(role: Role | undefined): boolean {
  return role === "ADMIN";
}

export function isLecturer(role: Role | undefined): boolean {
  return role === "LECTURER";
}

export function isStudent(role: Role | undefined): boolean {
  return role === "STUDENT";
}

export function requireAdmin(role: Role | undefined): void {
  if (!isAdmin(role)) throw new Error("Forbidden: admin only");
}

export function requireLecturer(role: Role | undefined): void {
  if (!isLecturer(role) && !isAdmin(role)) throw new Error("Forbidden: lecturer or admin only");
}

export function requireAuth(role: Role | undefined): void {
  if (!role) throw new Error("Unauthorized");
}
