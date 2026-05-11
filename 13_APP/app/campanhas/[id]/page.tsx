import { BarChart } from "@/components/charts/BarChart";
import { LineChart } from "@/components/charts/LineChart";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CampaignDetailPage({
  params,
  searchParams
}: {
  params: { id: string };
  searchParams: { from?: string; to?: string; status?: string; metricType?: string; planPage?: string; logPage?: string; metricPage?: string; limit?: string; window?: string };
}) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      affiliateProduct: true,
      channel: true,
      briefs: { include: { promptTemplate: true }, orderBy: { createdAt: "asc" } },
      checklists: { orderBy: { createdAt: "asc" } },
      plans: { include: { contentBrief: true, checklist: true, logs: true, metrics: true }, orderBy: { scheduledFor: "asc" } },
      metrics: { orderBy: { snapshotAt: "asc" } }
    }
  });
  if (!campaign) return <section><h1>Campanha não encontrada</h1></section>;

  const window = searchParams.window || "30d";
  const now = new Date();
  const fromWindow = window === "7d" ? new Date(now.getTime() - 7 * 86400000) : window === "30d" ? new Date(now.getTime() - 30 * 86400000) : window === "90d" ? new Date(now.getTime() - 90 * 86400000) : null;
  const from = searchParams.from ? new Date(searchParams.from) : fromWindow;
  const to = searchParams.to ? new Date(searchParams.to) : now;
  const limit = Math.max(Number(searchParams.limit || "10"), 1);
  const planPage = Math.max(Number(searchParams.planPage || "1"), 1);
  const logPage = Math.max(Number(searchParams.logPage || "1"), 1);
  const metricPage = Math.max(Number(searchParams.metricPage || "1"), 1);

  const filteredPlans = campaign.plans.filter((plan) => {
    if (searchParams.status && plan.status !== searchParams.status) return false;
    if (from && plan.scheduledFor < from) return false;
    if (to && plan.scheduledFor > to) return false;
    return true;
  });

  const filteredMetricsAll = campaign.metrics.filter((metric) => {
    if (searchParams.metricType && metric.metricType !== searchParams.metricType) return false;
    if (from && metric.snapshotAt < from) return false;
    if (to && metric.snapshotAt > to) return false;
    return true;
  });

  const allLogs = filteredPlans.flatMap((plan) => plan.logs).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const plans = filteredPlans.slice((planPage - 1) * limit, planPage * limit);
  const pagedLogs = allLogs.slice((logPage - 1) * limit, logPage * limit);
  const pagedMetrics = filteredMetricsAll.slice((metricPage - 1) * limit, metricPage * limit);

  const ctrMetrics = filteredMetricsAll.filter((m) => m.metricType === "ctr");
  const avgCtr = ctrMetrics.length ? ctrMetrics.reduce((sum, item) => sum + item.metricValue, 0) / ctrMetrics.length : 0;

  const metricsByType = filteredMetricsAll.reduce<Record<string, number>>((acc, item) => {
    acc[item.metricType] = (acc[item.metricType] || 0) + item.metricValue;
    return acc;
  }, {});

  const statusSummary = filteredPlans.reduce<Record<string, number>>((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  const planScores = filteredPlans
    .map((plan) => ({ id: plan.id, title: plan.title, score: plan.metrics.reduce((sum, m) => sum + m.metricValue, 0), status: plan.status }))
    .sort((a, b) => b.score - a.score);

  const timeline = [
    ...campaign.briefs.map((brief) => ({ date: brief.createdAt, label: `Brief criado: ${brief.title}` })),
    ...campaign.checklists.map((check) => ({ date: check.createdAt, label: `Checklist criado: ${check.title}` })),
    ...filteredPlans.map((plan) => ({ date: plan.createdAt, label: `Plano criado: ${plan.title}` })),
    ...allLogs.map((log) => ({ date: log.createdAt, label: `Publicação ${log.status}` })),
    ...filteredMetricsAll.map((metric) => ({ date: metric.snapshotAt, label: `Métrica ${metric.metricType}: ${metric.metricValue}` }))
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

  const metricSeries = filteredMetricsAll
    .sort((a, b) => a.snapshotAt.getTime() - b.snapshotAt.getTime())
    .map((m) => ({ label: m.snapshotAt.toLocaleDateString("pt-BR"), value: m.metricValue }));

  const metricBars = Object.entries(metricsByType).map(([label, value]) => ({ label, value }));
  const makeQuery = (updates: Record<string, string>) => {
    const qs = new URLSearchParams(searchParams as Record<string, string>);
    for (const [k, v] of Object.entries(updates)) qs.set(k, v);
    return `?${qs.toString()}`;
  };

  return (
    <section>
      <h1>{campaign.name}</h1>
      <div className="card">
        <p><strong>Objetivo:</strong> {campaign.objective}</p>
        <p><strong>Status:</strong> {campaign.status}</p>
        <p><strong>Canal:</strong> {campaign.channel.name}</p>
        <p><strong>Produto afiliado:</strong> {campaign.affiliateProduct?.name || "Não vinculado"}</p>
      </div>

      <form className="card" style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Filtros da campanha</h3>
        <div className="grid">
          <select name="window" defaultValue={window}><option value="7d">7 dias</option><option value="30d">30 dias</option><option value="90d">90 dias</option><option value="custom">Custom</option></select>
          <input type="date" name="from" defaultValue={searchParams.from || ""} />
          <input type="date" name="to" defaultValue={searchParams.to || ""} />
          <select name="status" defaultValue={searchParams.status || ""}><option value="">Todos status</option><option value="planned">planned</option><option value="pending">pending</option><option value="published">published</option><option value="error">error</option><option value="cancelled">cancelled</option></select>
          <select name="metricType" defaultValue={searchParams.metricType || ""}><option value="">Todos tipos</option><option value="views">views</option><option value="clicks">clicks</option><option value="ctr">ctr</option><option value="saves">saves</option><option value="shares">shares</option><option value="comments">comments</option></select>
          <button type="submit">Aplicar filtros</button>
        </div>
      </form>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <a href={`/api/export/campanhas/${campaign.id}?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=csv&mode=summary`}>CSV resumo</a>
        <a href={`/api/export/campanhas/${campaign.id}?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=json&mode=detailed`}>JSON detalhado</a>
        <a href={`/api/export/campanhas/${campaign.id}?${new URLSearchParams(searchParams as Record<string, string>).toString()}&bundle=zip&mode=detailed`}>ZIP</a>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card"><h3 style={{ marginTop: 0 }}>CTR médio</h3><div className="kpi">{avgCtr.toFixed(2)}</div></div>
        <div className="card"><h3 style={{ marginTop: 0 }}>Volume</h3><p>Briefs: {campaign.briefs.length} | Planos: {filteredPlans.length} | Logs: {allLogs.length} | Métricas: {filteredMetricsAll.length}</p></div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card"><h3 style={{ marginTop: 0 }}>Comparação por tipo de métrica</h3><BarChart bars={metricBars} /></div>
        <div className="card"><h3 style={{ marginTop: 0 }}>Resumo por status</h3><ul>{Object.entries(statusSummary).map(([k, v]) => <li key={k}>{k}: {v}</li>)}</ul></div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Evolução temporal das métricas</h3>
        <LineChart points={metricSeries} />
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Top publicações por desempenho</h3>
        <ul>{planScores.slice(0, 5).map((p) => <li key={p.id}>{p.title} - score {p.score.toFixed(2)} - {p.status}</li>)}</ul>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card"><h3 style={{ marginTop: 0 }}>Planos (paginados)</h3><ul>{plans.map((p) => <li key={p.id}>{p.title} - {p.status}</li>)}</ul><div style={{ display: "flex", gap: 10 }}>{planPage > 1 && <a href={makeQuery({ planPage: String(planPage - 1) })}>Anterior</a>}{planPage * limit < filteredPlans.length && <a href={makeQuery({ planPage: String(planPage + 1) })}>Próxima</a>}</div></div>
        <div className="card"><h3 style={{ marginTop: 0 }}>Logs (paginados)</h3><ul>{pagedLogs.map((l) => <li key={l.id}>{l.createdAt.toLocaleString("pt-BR")} - {l.status}</li>)}</ul><div style={{ display: "flex", gap: 10 }}>{logPage > 1 && <a href={makeQuery({ logPage: String(logPage - 1) })}>Anterior</a>}{logPage * limit < allLogs.length && <a href={makeQuery({ logPage: String(logPage + 1) })}>Próxima</a>}</div></div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Métricas (paginadas)</h3>
        <ul>{pagedMetrics.map((m) => <li key={m.id}>{m.snapshotAt.toLocaleString("pt-BR")} - {m.metricType}: {m.metricValue}</li>)}</ul>
        <div style={{ display: "flex", gap: 10 }}>{metricPage > 1 && <a href={makeQuery({ metricPage: String(metricPage - 1) })}>Anterior</a>}{metricPage * limit < filteredMetricsAll.length && <a href={makeQuery({ metricPage: String(metricPage + 1) })}>Próxima</a>}</div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Timeline</h3>
        <ul>{timeline.map((event, idx) => <li key={`${event.label}-${idx}`}>{event.date.toLocaleString("pt-BR")} - {event.label}</li>)}</ul>
      </div>
    </section>
  );
}
