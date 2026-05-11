import { redirect } from "next/navigation";
import { getSessionUser } from "@/features/auth/session";

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(role: "admin" | "editor") {
  const user = await requireUser();
  if (user.role !== role) redirect("/");
  return user;
}
