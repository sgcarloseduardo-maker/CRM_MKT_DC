"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/features/audit/log";

export async function createInstagramBrief(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const objective = String(formData.get("objective") || "").trim();
  const targetPersona = String(formData.get("targetPersona") || "").trim();
  const promptTemplateId = String(formData.get("promptTemplateId") || "").trim();
  const campaignId = String(formData.get("campaignId") || "").trim();

  if (!title || !objective || !targetPersona) {
    throw new Error("Título, objetivo e persona são obrigatórios.");
  }

  const channel = await prisma.channel.findUnique({ where: { slug: "instagram" } });
  if (!channel) throw new Error("Canal Instagram não encontrado.");

  const created = await prisma.contentBrief.create({
    data: {
      title,
      objective,
      targetPersona,
      payloadJson: JSON.stringify({ source: "instagram-form" }),
      channelId: channel.id,
      campaignId: campaignId || null,
      promptTemplateId: promptTemplateId || null
    }
  });
  await writeAuditLog({
    entityType: "ContentBrief",
    entityId: created.id,
    action: "create",
    summary: "Brief criado no fluxo Instagram",
    payload: { title, objective, targetPersona }
  });

  revalidatePath("/canais/instagram");
}

export async function createInstagramChecklist(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const contentBriefId = String(formData.get("contentBriefId") || "").trim();
  const campaignId = String(formData.get("campaignId") || "").trim();
  const rulesText = String(formData.get("rulesText") || "").trim();

  if (!title || !rulesText) throw new Error("Título e regras são obrigatórios.");

  const channel = await prisma.channel.findUnique({ where: { slug: "instagram" } });
  if (!channel) throw new Error("Canal Instagram não encontrado.");

  const rules = rulesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const created = await prisma.complianceChecklist.create({
    data: {
      title,
      rulesJson: JSON.stringify(rules),
      channelId: channel.id,
      campaignId: campaignId || null,
      contentBriefId: contentBriefId || null
    }
  });
  await writeAuditLog({
    entityType: "ComplianceChecklist",
    entityId: created.id,
    action: "create",
    summary: "Checklist criado no fluxo Instagram",
    payload: { title, rulesCount: rules.length }
  });

  revalidatePath("/canais/instagram");
}

export async function createInstagramPlan(formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  const format = String(formData.get("format") || "").trim();
  const scheduledFor = String(formData.get("scheduledFor") || "").trim();
  const contentBriefId = String(formData.get("contentBriefId") || "").trim();
  const checklistId = String(formData.get("checklistId") || "").trim();
  const campaignId = String(formData.get("campaignId") || "").trim();

  if (!title || !format || !scheduledFor) {
    throw new Error("Título, formato e data/hora são obrigatórios.");
  }

  const channel = await prisma.channel.findUnique({ where: { slug: "instagram" } });
  if (!channel) throw new Error("Canal Instagram não encontrado.");

  const created = await prisma.publicationPlan.create({
    data: {
      title,
      format,
      scheduledFor: new Date(scheduledFor),
      channelId: channel.id,
      campaignId: campaignId || null,
      contentBriefId: contentBriefId || null,
      checklistId: checklistId || null
    }
  });
  await writeAuditLog({
    entityType: "PublicationPlan",
    entityId: created.id,
    action: "create",
    summary: "Planejamento criado no fluxo Instagram",
    payload: { title, format, scheduledFor }
  });

  revalidatePath("/canais/instagram");
}

export async function updateInstagramBrief(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const objective = String(formData.get("objective") || "").trim();
  const targetPersona = String(formData.get("targetPersona") || "").trim();
  if (!id || !title || !objective || !targetPersona) throw new Error("Dados inválidos para edição do brief.");

  const before = await prisma.contentBrief.findUnique({ where: { id } });
  const updated = await prisma.contentBrief.update({
    where: { id },
    data: { title, objective, targetPersona }
  });
  await writeAuditLog({
    entityType: "ContentBrief",
    entityId: updated.id,
    action: "update",
    summary: "Brief atualizado",
    payload: { title, objective, targetPersona },
    before: before ? { title: before.title, objective: before.objective, targetPersona: before.targetPersona, status: before.status } : null,
    after: { title: updated.title, objective: updated.objective, targetPersona: updated.targetPersona, status: updated.status }
  });
  revalidatePath("/canais/instagram");
}

export async function updateInstagramChecklist(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const isApproved = String(formData.get("isApproved") || "") === "on";
  const rulesText = String(formData.get("rulesText") || "").trim();
  if (!id || !title || !rulesText) throw new Error("Dados inválidos para edição do checklist.");

  const rules = rulesText
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const before = await prisma.complianceChecklist.findUnique({ where: { id } });
  const updated = await prisma.complianceChecklist.update({
    where: { id },
    data: { title, isApproved, rulesJson: JSON.stringify(rules), reviewedAt: isApproved ? new Date() : null }
  });
  await writeAuditLog({
    entityType: "ComplianceChecklist",
    entityId: updated.id,
    action: "update",
    summary: "Checklist atualizado",
    payload: { title, isApproved },
    before: before ? { title: before.title, isApproved: before.isApproved, rulesJson: before.rulesJson } : null,
    after: { title: updated.title, isApproved: updated.isApproved, rulesJson: updated.rulesJson }
  });
  revalidatePath("/canais/instagram");
}

export async function updateInstagramPlan(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const format = String(formData.get("format") || "").trim();
  const status = String(formData.get("status") || "").trim();
  const scheduledFor = String(formData.get("scheduledFor") || "").trim();
  if (!id || !title || !format || !status || !scheduledFor) throw new Error("Dados inválidos para edição do planejamento.");

  const before = await prisma.publicationPlan.findUnique({ where: { id } });
  const updated = await prisma.publicationPlan.update({
    where: { id },
    data: { title, format, status, scheduledFor: new Date(scheduledFor) }
  });
  await writeAuditLog({
    entityType: "PublicationPlan",
    entityId: updated.id,
    action: "update",
    summary: "Planejamento atualizado",
    payload: { title, format, status },
    before: before ? { title: before.title, format: before.format, status: before.status, scheduledFor: before.scheduledFor } : null,
    after: { title: updated.title, format: updated.format, status: updated.status, scheduledFor: updated.scheduledFor }
  });
  revalidatePath("/canais/instagram");
}

export async function createInstagramPublicationLog(formData: FormData) {
  const publicationPlanId = String(formData.get("publicationPlanId") || "").trim();
  const status = String(formData.get("status") || "pending").trim();
  const outcome = String(formData.get("outcome") || "").trim();
  const url = String(formData.get("url") || "").trim();
  const postedAt = String(formData.get("postedAt") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  if (!publicationPlanId) throw new Error("Plano de publicação é obrigatório.");

  const plan = await prisma.publicationPlan.findUnique({ where: { id: publicationPlanId } });
  if (!plan) throw new Error("Plano não encontrado.");

  const created = await prisma.publicationLog.create({
    data: {
      publicationPlanId,
      channelId: plan.channelId,
      status,
      outcome: outcome || null,
      url: url || null,
      postedAt: postedAt ? new Date(postedAt) : null,
      notes: notes || null
    }
  });

  await prisma.publicationPlan.update({
    where: { id: publicationPlanId },
    data: { status }
  });
  await writeAuditLog({
    entityType: "PublicationLog",
    entityId: created.id,
    action: "create",
    summary: "Log de publicação criado",
    payload: { publicationPlanId, status, url }
  });

  revalidatePath("/canais/instagram");
}

export async function createInstagramMetricSnapshot(formData: FormData) {
  const publicationPlanId = String(formData.get("publicationPlanId") || "").trim();
  const metricType = String(formData.get("metricType") || "").trim();
  const metricValue = Number(String(formData.get("metricValue") || "0").trim());
  const snapshotAt = String(formData.get("snapshotAt") || "").trim();

  if (!publicationPlanId || !metricType || Number.isNaN(metricValue) || !snapshotAt) {
    throw new Error("Dados inválidos para métrica.");
  }

  const plan = await prisma.publicationPlan.findUnique({ where: { id: publicationPlanId } });
  if (!plan) throw new Error("Plano não encontrado.");

  const created = await prisma.metricSnapshot.create({
    data: {
      publicationPlanId,
      campaignId: plan.campaignId,
      channelId: plan.channelId,
      metricType,
      metricValue,
      snapshotAt: new Date(snapshotAt)
    }
  });
  await writeAuditLog({
    entityType: "MetricSnapshot",
    entityId: created.id,
    action: "create",
    summary: "Métrica registrada",
    payload: { publicationPlanId, metricType, metricValue }
  });

  revalidatePath("/canais/instagram");
}

export async function updateInstagramPublicationLog(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const status = String(formData.get("status") || "pending").trim();
  const url = String(formData.get("url") || "").trim();
  const postedAt = String(formData.get("postedAt") || "").trim();
  const outcome = String(formData.get("outcome") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  if (!id) throw new Error("ID do log é obrigatório.");

  const before = await prisma.publicationLog.findUnique({ where: { id } });
  const updated = await prisma.publicationLog.update({
    where: { id },
    data: {
      status,
      url: url || null,
      postedAt: postedAt ? new Date(postedAt) : null,
      outcome: outcome || null,
      notes: notes || null
    }
  });
  await writeAuditLog({
    entityType: "PublicationLog",
    entityId: updated.id,
    action: "update",
    summary: "Log de publicação atualizado",
    payload: { status, url, postedAt },
    before: before ? { status: before.status, url: before.url, postedAt: before.postedAt, outcome: before.outcome, notes: before.notes } : null,
    after: { status: updated.status, url: updated.url, postedAt: updated.postedAt, outcome: updated.outcome, notes: updated.notes }
  });
  revalidatePath("/canais/instagram");
  revalidatePath("/");
}

export async function deleteInstagramPublicationLog(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const confirm = String(formData.get("confirm") || "").trim();
  if (!id || confirm !== "DELETE") throw new Error("Confirmação inválida para exclusão do log.");

  await prisma.publicationLog.delete({ where: { id } });
  await writeAuditLog({
    entityType: "PublicationLog",
    entityId: id,
    action: "delete",
    summary: "Log de publicação removido"
  });
  revalidatePath("/canais/instagram");
  revalidatePath("/");
}

export async function updateInstagramMetricSnapshot(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const metricType = String(formData.get("metricType") || "").trim();
  const metricValue = Number(String(formData.get("metricValue") || "0").trim());
  const snapshotAt = String(formData.get("snapshotAt") || "").trim();
  if (!id || !metricType || Number.isNaN(metricValue) || !snapshotAt) {
    throw new Error("Dados inválidos para atualizar métrica.");
  }

  const before = await prisma.metricSnapshot.findUnique({ where: { id } });
  const updated = await prisma.metricSnapshot.update({
    where: { id },
    data: { metricType, metricValue, snapshotAt: new Date(snapshotAt) }
  });
  await writeAuditLog({
    entityType: "MetricSnapshot",
    entityId: updated.id,
    action: "update",
    summary: "Métrica atualizada",
    payload: { metricType, metricValue },
    before: before ? { metricType: before.metricType, metricValue: before.metricValue, snapshotAt: before.snapshotAt } : null,
    after: { metricType: updated.metricType, metricValue: updated.metricValue, snapshotAt: updated.snapshotAt }
  });
  revalidatePath("/canais/instagram");
  revalidatePath("/");
}

export async function deleteInstagramMetricSnapshot(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const confirm = String(formData.get("confirm") || "").trim();
  if (!id || confirm !== "DELETE") throw new Error("Confirmação inválida para exclusão da métrica.");

  await prisma.metricSnapshot.delete({ where: { id } });
  await writeAuditLog({
    entityType: "MetricSnapshot",
    entityId: id,
    action: "delete",
    summary: "Métrica removida"
  });
  revalidatePath("/canais/instagram");
  revalidatePath("/");
}
