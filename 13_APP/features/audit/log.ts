import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/features/auth/session";

type AuditInput = {
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete";
  summary?: string;
  payload?: unknown;
  actor?: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
};

function buildDiff(before?: Record<string, unknown> | null, after?: Record<string, unknown> | null) {
  if (!before || !after) return null;
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const diff: Record<string, { before: unknown; after: unknown }> = {};
  for (const key of keys) {
    const a = before[key];
    const b = after[key];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      diff[key] = { before: a, after: b };
    }
  }
  return Object.keys(diff).length ? diff : null;
}

export async function writeAuditLog(input: AuditInput) {
  const diff = buildDiff(input.before, input.after);
  const sessionUser = await getSessionUser();
  const actor = input.actor || sessionUser?.username || "local-admin";
  await prisma.auditLog.create({
    data: {
      entityType: input.entityType,
      entityId: input.entityId,
      action: input.action,
      actor,
      actorUserId: sessionUser?.id,
      summary: input.summary || null,
      payloadJson: input.payload ? JSON.stringify(input.payload) : null,
      diffJson: diff ? JSON.stringify(diff) : null
    }
  });
}
