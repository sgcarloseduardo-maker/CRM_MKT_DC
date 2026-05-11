import { prisma } from "@/lib/prisma";
import { asExportResponse } from "@/features/export/utils";
import JSZip from "jszip";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "csv") as "csv" | "json";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const metricType = url.searchParams.get("metricType");
  const mode = url.searchParams.get("mode") || "summary";
  const bundle = url.searchParams.get("bundle") || "single";

  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: { plans: { include: { metrics: true, logs: true }, orderBy: { scheduledFor: "asc" } } }
  });
  if (!campaign) return asExportResponse([], "campanha_empty", format);

  const rows = campaign.plans.flatMap((p) =>
    p.metrics
      .filter((m) => {
        if (metricType && m.metricType !== metricType) return false;
        if (from && m.snapshotAt < new Date(from)) return false;
        if (to && m.snapshotAt > new Date(to)) return false;
        return true;
      })
      .map((m) => ({
        campaignId: campaign.id,
        campaignName: campaign.name,
        planId: p.id,
        planTitle: p.title,
        planStatus: p.status,
        metricType: m.metricType,
        metricValue: m.metricValue,
        snapshotAt: m.snapshotAt.toISOString(),
        logCount: p.logs.length,
        ...(mode === "detailed" ? { channelId: campaign.channelId, campaignStatus: campaign.status } : {})
      }))
  );

  if (bundle === "zip") {
    const zip = new JSZip();
    zip.file("campanha_metrics.json", JSON.stringify(rows, null, 2));
    zip.file("campanha_metrics.csv", asCsv(rows));
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return new Response(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="campanha_${campaign.id}_${Date.now()}.zip"`
      }
    });
  }

  return asExportResponse(rows, `campanha_${campaign.id}`, format);
}

function asCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
