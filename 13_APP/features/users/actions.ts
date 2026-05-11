"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/features/audit/log";

export async function createUserAction(formData: FormData) {
  const username = String(formData.get("username") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const role = String(formData.get("role") || "editor");
  if (!username || !password) throw new Error("Usuário e senha são obrigatórios.");

  const passwordHash = await hash(password, 10);
  const user = await prisma.user.create({
    data: { username, passwordHash, role, isActive: true }
  });
  await writeAuditLog({ entityType: "User", entityId: user.id, action: "create", summary: "Usuário criado", payload: { username, role } });
  revalidatePath("/admin/usuarios");
}

export async function updateUserRoleAction(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const role = String(formData.get("role") || "editor");
  if (!id) throw new Error("ID inválido");
  const before = await prisma.user.findUnique({ where: { id } });
  const updated = await prisma.user.update({ where: { id }, data: { role } });
  await writeAuditLog({
    entityType: "User",
    entityId: updated.id,
    action: "update",
    summary: "Papel do usuário alterado",
    before: before ? { role: before.role } : null,
    after: { role: updated.role }
  });
  revalidatePath("/admin/usuarios");
}

export async function toggleUserActiveAction(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const current = String(formData.get("current") || "").trim() === "true";
  if (!id) throw new Error("ID inválido");
  const updated = await prisma.user.update({ where: { id }, data: { isActive: !current } });
  await writeAuditLog({ entityType: "User", entityId: id, action: "update", summary: `Usuário ${updated.isActive ? "ativado" : "desativado"}` });
  revalidatePath("/admin/usuarios");
}

export async function resetUserPasswordAction(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const password = String(formData.get("password") || "").trim();
  if (!id || !password) throw new Error("ID e nova senha são obrigatórios.");
  const passwordHash = await hash(password, 10);
  await prisma.user.update({ where: { id }, data: { passwordHash } });
  await writeAuditLog({ entityType: "User", entityId: id, action: "update", summary: "Senha resetada" });
  revalidatePath("/admin/usuarios");
}
