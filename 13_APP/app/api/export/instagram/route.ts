import { prisma } from "@/lib/prisma";
import { asExportResponse } from "@/features/export/utils";
import JSZip from "jszip";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "csv") as "csv" | "json";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const campaignId = url.searchParams.get("campaignId");
  const status = url.searchParams.get("status");
  const metricType = url.searchParams.get("metricType");
  const mode = url.searchParams.get("mode") || "summary";
  const bundle = url.searchParams.get("bundle") || "single";

  const channel = await prisma.channel.findUnique({ where: { slug: "instagram" } });
  if (!channel) return asExportResponse([], "instagram_empty", format);

  const where: Record<string, unknown> = { channelId: channel.id };
  if (campaignId) where.campaignId = campaignId;
  if (status) where.status = status;
  if (from || to) {
    where.scheduledFor = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {})
    };
  }

  const plans = await prisma.publicationPlan.findMany({
    where,
    include: { logs: true, metrics: true, campaign: true },
    orderBy: { scheduledFor: "desc" }
  });

  const rows = plans.flatMap((p) =>
    p.metrics
      .filter((m) => !metricType || m.metricType === metricType)
      .map((m) => ({
        planId: p.id,
        planTitle: p.title,
        planStatus: p.status,
        campaign: p.campaign?.name || "",
        metricType: m.metricType,
        metricValue: m.metricValue,
        snapshotAt: m.snapshotAt.toISOString(),
        logCount: p.logs.length,
        ...(mode === "detailed" ? { channelId: p.channelId, campaignId: p.campaignId || "" } : {})
      }))
  );

  if (bundle === "zip") {
    const zip = new JSZip();
    zip.file("instagram_metrics.json", JSON.stringify(rows, null, 2));
    zip.file("instagram_metrics.csv", asCsv(rows));
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return new Response(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="instagram_metrics_${Date.now()}.zip"`
      }
    });
  }

  return asExportResponse(rows, "instagram_metrics", format);
}

function asCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
