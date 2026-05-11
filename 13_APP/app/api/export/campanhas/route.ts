import { prisma } from "@/lib/prisma";
import { asExportResponse } from "@/features/export/utils";
import JSZip from "jszip";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const format = (url.searchParams.get("format") || "csv") as "csv" | "json";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const channelId = url.searchParams.get("channelId");
  const status = url.searchParams.get("status");
  const mode = url.searchParams.get("mode") || "summary";
  const bundle = url.searchParams.get("bundle") || "single";

  const where: Record<string, unknown> = {};
  if (channelId) where.channelId = channelId;
  if (status) where.status = status;
  if (from || to) {
    where.createdAt = {
      ...(from ? { gte: new Date(from) } : {}),
      ...(to ? { lte: new Date(to) } : {})
    };
  }

  const campaigns = await prisma.campaign.findMany({ where, include: { channel: true, affiliateProduct: true }, orderBy: { createdAt: "desc" } });
  const rows = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    status: c.status,
    objective: c.objective,
    channel: c.channel.name,
    product: c.affiliateProduct?.name || "",
    createdAt: c.createdAt.toISOString(),
    ...(mode === "detailed" ? { channelId: c.channelId, affiliateProductId: c.affiliateProductId || "" } : {})
  }));
  if (bundle === "zip") {
    const zip = new JSZip();
    zip.file("campanhas.json", JSON.stringify(rows, null, 2));
    zip.file("campanhas.csv", asCsv(rows));
    const content = await zip.generateAsync({ type: "nodebuffer" });
    return new Response(content, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="campanhas_${Date.now()}.zip"`
      }
    });
  }
  return asExportResponse(rows, "campanhas", format);
}

function asCsv(rows: Record<string, unknown>[]) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
}
