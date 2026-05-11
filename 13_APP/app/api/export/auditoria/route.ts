import { prisma } from "@/lib/prisma";
import { asExportResponse } from "@/features/export/utils";
import JSZip from "jszip";
import { requireAdminFromRequest } from "@/features/auth/api";

export async function GET(req: Request) {
  const admin = await requireAdminFromRequest(req);
  if (!admin) return new Response("Forbidden", { status: 403 });
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "csv") as "csv" | "json";
  const entityType = url.searchParams.get("entityType");
  const action = url.searchParams.get("action");
  const actor = url.searchParams.get("actor");
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const mode = url.searchParams.get("mode") || "summary";
  const bundle = url.searchParams.get("bundle") || "single";

  const where: Record<string, unknown> = {};
  if (entityType) where.entityType = entityType;
  if (action) where.action = action;
  if (actor) where.actor = actor;
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {})
    };
  }

  const logs = await prisma.auditLog.findMany({ where, orderBy: { createdAt: "desc" } });
  const rows = logs.map((l) => ({
    id: l.id,
    entityType: l.entityType,
    entityId: l.entityId,
    action: l.action,
    actor: l.actor,
    summary: l.summary || "",
    payloadJson: l.payloadJson || "",
    diffJson: mode === "detailed" ? l.diffJson || "" : "",
    createdAt: l.createdAt.toISOString()
  }));
  if (bundle === "zip") {
    const zip = new JSZip();
    zip.file("auditoria.json", JSON.stringify(rows, null, 2));
    zip.file("auditoria.csv", asCsv(rows));
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return new Response(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="auditoria_${Date.now()}.zip"`
      }
    });
  }
  return asExportResponse(rows, "auditoria", format);
}

function asCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
