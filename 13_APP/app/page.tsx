import Link from "next/link";
import Image from "next/image";
import { KpiCard } from "@/components/KpiCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { from?: string; to?: string; channelId?: string; status?: string; campaignId?: string; logPage?: string; campaignPage?: string; limit?: string };
}) {
  const limit = Math.max(Number(searchParams.limit || "5"), 1);
  const logPage = Math.max(Number(searchParams.logPage || "1"), 1);
  const campaignPage = Math.max(Number(searchParams.campaignPage || "1"), 1);
  const from = searchParams.from ? new Date(searchParams.from) : null;
  const to = searchParams.to ? new Date(searchParams.to) : null;

  const channels = await prisma.channel.findMany({ orderBy: { name: "asc" } });
  const campaignsList = await prisma.campaign.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  const planWhere: Record<string, unknown> = {};
  if (searchParams.channelId) planWhere.channelId = searchParams.channelId;
  if (searchParams.status) planWhere.status = searchParams.status;
  if (searchParams.campaignId) planWhere.campaignId = searchParams.campaignId;
  if (from || to) {
    planWhere.scheduledFor = {
      ...(from ? { gte: from } : {}),
      ...(to ? { lte: to } : {})
    };
  }

  const [
    products,
    contentMasters,
    channelContents,
    creativeAssets,
    activePrompts,
    campaigns,
    plans,
    logs,
    metrics,
    plansByChannel,
    latestLogs,
    latestCampaigns,
    totalLogs,
    totalCampaigns,
    plansByStatus,
    metricsByCampaign,
    recentAudit
  ] = await Promise.all([
    prisma.affiliateProduct.count(),
    prisma.contentMaster.count(),
    prisma.channelContent.count(),
    prisma.creativeAsset.count(),
    prisma.promptTemplate.count({ where: { active: true } }),
    prisma.campaign.count(),
    prisma.publicationPlan.count({ where: planWhere }),
    prisma.publicationLog.count({ where: { publicationPlan: planWhere } }),
    prisma.metricSnapshot.count({ where: { publicationPlan: planWhere } }),
    prisma.publicationPlan.groupBy({ by: ["channelId"], where: planWhere, _count: { _all: true } }),
    prisma.publicationLog.findMany({ where: { publicationPlan: planWhere }, include: { publicationPlan: true }, orderBy: { createdAt: "desc" }, skip: (logPage - 1) * limit, take: limit }),
    prisma.campaign.findMany({ include: { channel: true }, orderBy: { createdAt: "desc" }, skip: (campaignPage - 1) * limit, take: limit }),
    prisma.publicationLog.count({ where: { publicationPlan: planWhere } }),
    prisma.campaign.count(),
    prisma.publicationPlan.groupBy({ by: ["status"], where: planWhere, _count: { _all: true } }),
    prisma.metricSnapshot.groupBy({ by: ["campaignId"], where: { publicationPlan: planWhere }, _sum: { metricValue: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  ]);

  const [inProduction, approvedContents, publishedContents, validLinks] = await Promise.all([
    prisma.contentMaster.count({ where: { status: { in: ["em_producao", "em_revisao"] } } }),
    prisma.contentMaster.count({ where: { status: "aprovado" } }),
    prisma.publicationLog.count({ where: { status: "published" } }),
    prisma.affiliateProduct.count({ where: { affiliateUrl: { not: null } } })
  ]);

  const channelMap = new Map(channels.map((channel) => [channel.id, channel.name]));
  const makeQuery = (updates: Record<string, string>) => {
    const qs = new URLSearchParams(searchParams as Record<string, string>);
    for (const [k, v] of Object.entries(updates)) qs.set(k, v);
    return `?${qs.toString()}`;
  };
  const scored = metricsByCampaign.filter((m) => m.campaignId).sort((a, b) => (b._sum.metricValue || 0) - (a._sum.metricValue || 0));
  const ids = scored.map((s) => s.campaignId!)
  const campaignsByScore = ids.length ? await prisma.campaign.findMany({ where: { id: { in: ids } } }) : [];
  const cmap = new Map(campaignsByScore.map((c) => [c.id, c.name]));
  const best = scored[0];
  const worst = scored[scored.length - 1];

  return (
    <section>
      <div className="dashboard-hero">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Visão consolidada de produção, aprovação, publicação e desempenho multicanal.</p>
        </div>
        <div className="dashboard-logo-wrap">
          <Image
            src="/brand/logo_horizontal_colorido.png"
            alt="Decisão Certa Ferramentas"
            width={340}
            height={90}
            priority
            className="dashboard-logo"
          />
        </div>
      </div>

      <form className="card" style={{ display: "grid", gap: 8, marginTop: 16 }}>
        <h3 style={{ margin: 0 }}>Filtros</h3>
        <div className="grid">
          <input type="date" name="from" defaultValue={searchParams.from || ""} />
          <input type="date" name="to" defaultValue={searchParams.to || ""} />
          <select name="channelId" defaultValue={searchParams.channelId || ""}>
            <option value="">Todos os canais</option>
            {channels.map((channel) => <option key={channel.id} value={channel.id}>{channel.name}</option>)}
          </select>
          <select name="campaignId" defaultValue={searchParams.campaignId || ""}>
            <option value="">Todos os projetos</option>
            {campaignsList.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
          </select>
          <select name="status" defaultValue={searchParams.status || ""}>
            <option value="">Todos os status</option>
            <option value="planned">planned</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="error">error</option>
            <option value="cancelled">cancelled</option>
          </select>
          <button type="submit">Aplicar filtros</button>
        </div>
      </form>

      <div className="dashboard-export-links" style={{ marginTop: 10 }}>
        <a className="quick-link" href={`/api/export/dashboard?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=csv&mode=summary`}>CSV resumo</a>
        <a className="quick-link" href={`/api/export/dashboard?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=json&mode=detailed`}>JSON detalhado</a>
        <a className="quick-link" href={`/api/export/dashboard?${new URLSearchParams(searchParams as Record<string, string>).toString()}&bundle=zip&mode=detailed`}>ZIP</a>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <KpiCard title="Em produção" value={String(inProduction)} note="Conteúdos em execução" />
        <KpiCard title="Aprovados" value={String(approvedContents)} note="Conteúdos validados" />
        <KpiCard title="Publicados" value={String(publishedContents)} note="Publicações concluídas" />
        <KpiCard title="Links afiliados válidos" value={String(validLinks)} note="Produtos com link ativo" />
        <KpiCard title="Produtos detectados" value={String(products)} note="Base de produtos afiliados" />
        <KpiCard title="Artigos-base" value={String(contentMasters)} note="Conteúdos mestres do pipeline" />
        <KpiCard title="Conteúdos por canal" value={String(channelContents)} note="Adaptações multicanal" />
        <KpiCard title="Peças criativas" value={String(creativeAssets)} note="Artes, thumbs e variações" />
        <KpiCard title="Prompts ativos" value={String(activePrompts)} note="Prompts criativos e operacionais" />
        <KpiCard title="Projetos" value={String(campaigns)} note="Projetos e campanhas em andamento" />
        <KpiCard title="Publicações planejadas" value={String(plans)} note="Fila de publicação" />
        <KpiCard title="Publicações executadas" value={String(logs)} note="Envios e resultados por canal" />
        <KpiCard title="Métricas coletadas" value={String(metrics)} note="Snapshots de desempenho" />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Comparativo de campanhas</h3>
        <p>Melhor: {best ? `${cmap.get(best.campaignId!) || best.campaignId} (${(best._sum.metricValue || 0).toFixed(2)})` : "-"}</p>
        <p>Pior: {worst ? `${cmap.get(worst.campaignId!) || worst.campaignId} (${(worst._sum.metricValue || 0).toFixed(2)})` : "-"}</p>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Últimas publicações</h3>
          {latestLogs.length === 0 ? <p className="muted">Sem registros.</p> : (
            <>
              <ul>{latestLogs.map((log) => <li key={log.id}>[{log.status}] {log.publicationPlan.title}</li>)}</ul>
              <div style={{ display: "flex", gap: 10 }}>
                {logPage > 1 && <a href={makeQuery({ logPage: String(logPage - 1), campaignPage: String(campaignPage), limit: String(limit) })}>Anterior</a>}
                {logPage * limit < totalLogs && <a href={makeQuery({ logPage: String(logPage + 1), campaignPage: String(campaignPage), limit: String(limit) })}>Próxima</a>}
              </div>
            </>
          )}
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Campanhas recentes</h3>
          {latestCampaigns.length === 0 ? <p className="muted">Sem campanhas.</p> : (
            <>
              <ul>{latestCampaigns.map((campaign) => <li key={campaign.id}><Link href={`/campanhas/${campaign.id}`}>{campaign.name}</Link> - {campaign.channel.name}</li>)}</ul>
              <div style={{ display: "flex", gap: 10 }}>
                {campaignPage > 1 && <a href={makeQuery({ campaignPage: String(campaignPage - 1), logPage: String(logPage), limit: String(limit) })}>Anterior</a>}
                {campaignPage * limit < totalCampaigns && <a href={makeQuery({ campaignPage: String(campaignPage + 1), logPage: String(logPage), limit: String(limit) })}>Próxima</a>}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Auditoria recente</h3>
        <ul>{recentAudit.map((a) => <li key={a.id}>[{a.action}] {a.entityType} - {a.summary || "sem resumo"}</li>)}</ul>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Publicações por canal</h3>
          <ul>{plansByChannel.map((item) => <li key={item.channelId}>{channelMap.get(item.channelId) ?? item.channelId}: {item._count._all}</li>)}</ul>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Status do fluxo</h3>
          <ul>{plansByStatus.map((item) => <li key={item.status}>{item.status}: {item._count._all}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
