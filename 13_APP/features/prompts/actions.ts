"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/features/audit/log";

export async function createPromptTemplate(formData: FormData) {
  try {
    const name = String(formData.get("name") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const objective = String(formData.get("objective") || "").trim();
    const format = String(formData.get("format") || "").trim();
    const channelId = String(formData.get("channelId") || "").trim();

    if (!name || !body) throw new Error("Nome e conteúdo são obrigatórios.");

    const created = await prisma.promptTemplate.create({
      data: {
        name,
        body,
        objective: objective || null,
        format: format || null,
        channelId: channelId || null,
        active: true
      }
    });
    await writeAuditLog({
      entityType: "PromptTemplate",
      entityId: created.id,
      action: "create",
      summary: "Prompt template criado",
      payload: { name, objective, format }
    });

    revalidatePath("/prompts-ia");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Falha ao criar prompt.");
  }
}

export async function updatePromptTemplate(formData: FormData) {
  try {
    const id = String(formData.get("id") || "").trim();
    const name = String(formData.get("name") || "").trim();
    const body = String(formData.get("body") || "").trim();
    const objective = String(formData.get("objective") || "").trim();
    const format = String(formData.get("format") || "").trim();

    if (!id || !name || !body) throw new Error("ID, nome e conteúdo são obrigatórios.");

    const before = await prisma.promptTemplate.findUnique({ where: { id } });
    const updated = await prisma.promptTemplate.update({
      where: { id },
      data: {
        name,
        body,
        objective: objective || null,
        format: format || null
      }
    });
    await writeAuditLog({
      entityType: "PromptTemplate",
      entityId: updated.id,
      action: "update",
      summary: "Prompt template atualizado",
      payload: { name, objective, format },
      before: before ? { name: before.name, body: before.body, objective: before.objective, format: before.format, active: before.active } : null,
      after: { name: updated.name, body: updated.body, objective: updated.objective, format: updated.format, active: updated.active }
    });

    revalidatePath("/prompts-ia");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Falha ao editar prompt.");
  }
}

export async function togglePromptTemplate(formData: FormData) {
  try {
    const id = String(formData.get("id") || "").trim();
    const current = String(formData.get("current") || "").trim() === "true";
    if (!id) throw new Error("ID inválido.");

    const before = await prisma.promptTemplate.findUnique({ where: { id } });
    const updated = await prisma.promptTemplate.update({
      where: { id },
      data: { active: !current }
    });
    await writeAuditLog({
      entityType: "PromptTemplate",
      entityId: updated.id,
      action: "update",
      summary: `Prompt template ${updated.active ? "ativado" : "desativado"}`,
      payload: { active: updated.active },
      before: before ? { active: before.active } : null,
      after: { active: updated.active }
    });

    revalidatePath("/prompts-ia");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Falha ao ativar/desativar prompt.");
  }
}
