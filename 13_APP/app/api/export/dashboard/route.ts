import { prisma } from "@/lib/prisma";
import { asExportResponse } from "@/features/export/utils";
import JSZip from "jszip";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "csv") as "csv" | "json";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const channelId = url.searchParams.get("channelId");
  const campaignId = url.searchParams.get("campaignId");
  const status = url.searchParams.get("status");
  const mode = url.searchParams.get("mode") || "summary";
  const bundle = url.searchParams.get("bundle") || "single";

  const planWhere: Record<string, unknown> = {};
  if (channelId) planWhere.channelId = channelId;
  if (campaignId) planWhere.campaignId = campaignId;
  if (status) planWhere.status = status;
  if (from || to) {
    planWhere.scheduledFor = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {})
    };
  }

  const logs = await prisma.publicationLog.findMany({
    where: { publicationPlan: planWhere },
    include: { publicationPlan: true },
    orderBy: { createdAt: "desc" }
  });
  const rows = logs.map((l) => ({
    logId: l.id,
    status: l.status,
    publicationTitle: l.publicationPlan.title,
    publicationStatus: l.publicationPlan.status,
    createdAt: l.createdAt.toISOString(),
    postedAt: l.postedAt?.toISOString() || "",
    url: l.url || "",
    outcome: l.outcome || "",
    notes: l.notes || "",
    ...(mode === "detailed" ? { publicationPlanId: l.publicationPlanId, channelId: l.channelId } : {})
  }));
  if (bundle === "zip") {
    const zip = new JSZip();
    zip.file("dashboard_logs.json", JSON.stringify(rows, null, 2));
    zip.file("dashboard_logs.csv", asCsv(rows));
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return new Response(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="dashboard_logs_${Date.now()}.zip"`
      }
    });
  }
  return asExportResponse(rows, "dashboard_logs", format);
}

function asCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
