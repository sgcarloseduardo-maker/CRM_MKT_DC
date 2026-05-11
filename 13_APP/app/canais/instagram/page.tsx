import {
  createInstagramBrief,
  createInstagramChecklist,
  createInstagramMetricSnapshot,
  createInstagramPlan,
  createInstagramPublicationLog,
  deleteInstagramMetricSnapshot,
  deleteInstagramPublicationLog,
  updateInstagramBrief,
  updateInstagramChecklist,
  updateInstagramMetricSnapshot,
  updateInstagramPlan,
  updateInstagramPublicationLog
} from "@/features/instagram/actions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function toLocalInputValue(date: Date) {
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60000).toISOString().slice(0, 16);
}

export default async function InstagramChannelPage({
  searchParams
}: {
  searchParams: { from?: string; to?: string; campaignId?: string; status?: string; metricType?: string; planPage?: string; logPage?: string; metricPage?: string; limit?: string; sort?: string };
}) {
  const channel = await prisma.channel.findUnique({
    where: { slug: "instagram" },
    include: {
      prompts: { orderBy: { createdAt: "desc" } },
      campaigns: { orderBy: { createdAt: "desc" } },
      briefs: { orderBy: { createdAt: "desc" }, include: { promptTemplate: true, campaign: true } },
      checklists: { orderBy: { createdAt: "desc" }, include: { contentBrief: true } }
    }
  });
  if (!channel) return <section><h1>Canal Instagram não encontrado</h1></section>;

  const fromDate = searchParams.from ? new Date(searchParams.from) : null;
  const toDate = searchParams.to ? new Date(searchParams.to) : null;
  const limit = Math.max(Number(searchParams.limit || "10"), 1);
  const planPage = Math.max(Number(searchParams.planPage || "1"), 1);
  const logPage = Math.max(Number(searchParams.logPage || "1"), 1);
  const metricPage = Math.max(Number(searchParams.metricPage || "1"), 1);

  const planWhere: Record<string, unknown> = { channelId: channel.id };
  if (searchParams.campaignId) planWhere.campaignId = searchParams.campaignId;
  if (searchParams.status) planWhere.status = searchParams.status;
  if (fromDate || toDate) {
    planWhere.scheduledFor = {
      ...(fromDate ? { gte: fromDate } : {}),
      ...(toDate ? { lte: toDate } : {})
    };
  }

  const plansRaw = await prisma.publicationPlan.findMany({
    where: planWhere,
    orderBy: { scheduledFor: "asc" },
    include: {
      contentBrief: true,
      checklist: true,
      campaign: true,
      logs: { orderBy: { createdAt: "desc" } },
      metrics: { orderBy: { snapshotAt: "desc" } }
    }
  });

  const sort = searchParams.sort || "scheduled_desc";
  let plansSorted = [...plansRaw];
  if (sort === "scheduled_asc") plansSorted.sort((a, b) => a.scheduledFor.getTime() - b.scheduledFor.getTime());
  if (sort === "scheduled_desc") plansSorted.sort((a, b) => b.scheduledFor.getTime() - a.scheduledFor.getTime());
  if (sort === "status") plansSorted.sort((a, b) => a.status.localeCompare(b.status));
  if (sort === "name") plansSorted.sort((a, b) => a.title.localeCompare(b.title));

  const allLogs = plansSorted.flatMap((p) => p.logs).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const allMetrics = plansSorted
    .flatMap((p) => p.metrics)
    .filter((m) => !searchParams.metricType || m.metricType === searchParams.metricType)
    .sort((a, b) => b.snapshotAt.getTime() - a.snapshotAt.getTime());

  const plans = plansSorted.slice((planPage - 1) * limit, planPage * limit);
  const logs = allLogs.slice((logPage - 1) * limit, logPage * limit);
  const metrics = allMetrics.slice((metricPage - 1) * limit, metricPage * limit);
  const makeQuery = (updates: Record<string, string>) => {
    const qs = new URLSearchParams(searchParams as Record<string, string>);
    for (const [k, v] of Object.entries(updates)) qs.set(k, v);
    return `?${qs.toString()}`;
  };

  return (
    <section>
      <h1>Canal: Instagram</h1>
      <p className="muted">Fluxo completo: Brief -&gt; Prompt/Copy -&gt; Checklist -&gt; Planejamento -&gt; Publicação -&gt; Métricas</p>

      <form className="card" style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Filtros operacionais</h3>
        <div className="grid">
          <input type="date" name="from" defaultValue={searchParams.from || ""} />
          <input type="date" name="to" defaultValue={searchParams.to || ""} />
          <select name="campaignId" defaultValue={searchParams.campaignId || ""}>
            <option value="">Todas campanhas</option>
            {channel.campaigns.map((campaign) => <option key={campaign.id} value={campaign.id}>{campaign.name}</option>)}
          </select>
          <select name="status" defaultValue={searchParams.status || ""}>
            <option value="">Todos status</option>
            <option value="planned">planned</option>
            <option value="pending">pending</option>
            <option value="published">published</option>
            <option value="error">error</option>
            <option value="cancelled">cancelled</option>
          </select>
          <select name="metricType" defaultValue={searchParams.metricType || ""}>
            <option value="">Todos tipos de métrica</option>
            <option value="views">views</option>
            <option value="clicks">clicks</option>
            <option value="ctr">ctr</option>
            <option value="saves">saves</option>
            <option value="shares">shares</option>
            <option value="comments">comments</option>
          </select>
          <select name="sort" defaultValue={searchParams.sort || "scheduled_desc"}>
            <option value="scheduled_desc">Agendado desc</option>
            <option value="scheduled_asc">Agendado asc</option>
            <option value="status">Status</option>
            <option value="name">Nome</option>
          </select>
          <button type="submit">Aplicar filtros</button>
        </div>
      </form>

      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <a href={`/api/export/instagram?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=csv&mode=summary`}>CSV resumo</a>
        <a href={`/api/export/instagram?${new URLSearchParams(searchParams as Record<string, string>).toString()}&format=json&mode=detailed`}>JSON detalhado</a>
        <a href={`/api/export/instagram?${new URLSearchParams(searchParams as Record<string, string>).toString()}&bundle=zip&mode=detailed`}>ZIP</a>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createInstagramBrief} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>1) Brief</h3>
          <input name="title" placeholder="Título do brief" required />
          <input name="objective" placeholder="Objetivo" required />
          <input name="targetPersona" placeholder="Persona" required />
          <select name="campaignId" defaultValue=""><option value="">Sem campanha</option>{channel.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <select name="promptTemplateId" defaultValue=""><option value="">Sem prompt</option>{channel.prompts.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <button type="submit">Salvar brief</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>2) Prompt/Copy + edição brief</h3>
          {channel.briefs.map((brief) => (
            <form key={brief.id} action={updateInstagramBrief} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, display: "grid", gap: 8, marginBottom: 8 }}>
              <input type="hidden" name="id" value={brief.id} />
              <input name="title" defaultValue={brief.title} required />
              <input name="objective" defaultValue={brief.objective} required />
              <input name="targetPersona" defaultValue={brief.targetPersona} required />
              <div className="muted">Prompt: {brief.promptTemplate?.name || "Sem prompt"}</div>
              <button type="submit">Atualizar brief</button>
            </form>
          ))}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createInstagramChecklist} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>3) Checklist</h3>
          <input name="title" placeholder="Título do checklist" required />
          <select name="contentBriefId" defaultValue=""><option value="">Sem brief</option>{channel.briefs.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}</select>
          <select name="campaignId" defaultValue=""><option value="">Sem campanha</option>{channel.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <textarea name="rulesText" rows={3} placeholder="Uma regra por linha" required />
          <button type="submit">Salvar checklist</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Edição de checklists</h3>
          {channel.checklists.map((checklist) => (
            <form key={checklist.id} action={updateInstagramChecklist} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, display: "grid", gap: 8, marginBottom: 8 }}>
              <input type="hidden" name="id" value={checklist.id} />
              <input name="title" defaultValue={checklist.title} required />
              <textarea name="rulesText" defaultValue={JSON.parse(checklist.rulesJson).join("\n")} rows={3} required />
              <label><input type="checkbox" name="isApproved" defaultChecked={checklist.isApproved} /> Aprovado</label>
              <button type="submit">Atualizar checklist</button>
            </form>
          ))}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createInstagramPlan} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>4) Planejamento</h3>
          <input name="title" placeholder="Título da publicação" required />
          <input name="format" placeholder="Formato" required />
          <input name="scheduledFor" type="datetime-local" required />
          <select name="contentBriefId" defaultValue=""><option value="">Sem brief</option>{channel.briefs.map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}</select>
          <select name="checklistId" defaultValue=""><option value="">Sem checklist</option>{channel.checklists.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
          <select name="campaignId" defaultValue=""><option value="">Sem campanha</option>{channel.campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
          <button type="submit">Salvar planejamento</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Edição de planejamentos</h3>
          {plans.map((plan) => (
            <form key={plan.id} action={updateInstagramPlan} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, display: "grid", gap: 8, marginBottom: 8 }}>
              <input type="hidden" name="id" value={plan.id} />
              <input name="title" defaultValue={plan.title} required />
              <input name="format" defaultValue={plan.format} required />
              <input name="scheduledFor" type="datetime-local" defaultValue={toLocalInputValue(plan.scheduledFor)} required />
              <select name="status" defaultValue={plan.status}>
                <option value="planned">planned</option><option value="pending">pending</option><option value="published">published</option><option value="error">error</option><option value="cancelled">cancelled</option>
              </select>
              <button type="submit">Atualizar plano</button>
            </form>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            {planPage > 1 && <a href={makeQuery({ planPage: String(planPage - 1), logPage: String(logPage), metricPage: String(metricPage), limit: String(limit) })}>Anterior</a>}
            {planPage * limit < plansSorted.length && <a href={makeQuery({ planPage: String(planPage + 1), logPage: String(logPage), metricPage: String(metricPage), limit: String(limit) })}>Próxima</a>}
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createInstagramPublicationLog} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>5) Publicação (log)</h3>
          <select name="publicationPlanId" required defaultValue=""><option value="">Selecione um plano</option>{plans.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
          <select name="status" defaultValue="published"><option value="published">published</option><option value="error">error</option><option value="cancelled">cancelled</option><option value="pending">pending</option></select>
          <input name="url" placeholder="URL" />
          <input name="postedAt" type="datetime-local" />
          <input name="outcome" placeholder="Outcome" />
          <textarea name="notes" rows={3} placeholder="Observações" />
          <button type="submit">Registrar publicação</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Edição/Exclusão de logs</h3>
          {logs.map((log) => (
            <div key={log.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
              <form action={updateInstagramPublicationLog} style={{ display: "grid", gap: 8 }}>
                <input type="hidden" name="id" value={log.id} />
                <select name="status" defaultValue={log.status}><option value="published">published</option><option value="error">error</option><option value="cancelled">cancelled</option><option value="pending">pending</option></select>
                <input name="url" defaultValue={log.url || ""} placeholder="URL" />
                <input name="postedAt" type="datetime-local" defaultValue={log.postedAt ? toLocalInputValue(log.postedAt) : ""} />
                <input name="outcome" defaultValue={log.outcome || ""} placeholder="Outcome" />
                <textarea name="notes" rows={2} defaultValue={log.notes || ""} />
                <button type="submit">Atualizar log</button>
              </form>
              <form action={deleteInstagramPublicationLog} style={{ marginTop: 8, display: "grid", gap: 6 }}>
                <input type="hidden" name="id" value={log.id} />
                <input name="confirm" placeholder="Digite DELETE para excluir" required />
                <button type="submit">Excluir log</button>
              </form>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            {logPage > 1 && <a href={makeQuery({ logPage: String(logPage - 1), planPage: String(planPage), metricPage: String(metricPage), limit: String(limit) })}>Anterior</a>}
            {logPage * limit < allLogs.length && <a href={makeQuery({ logPage: String(logPage + 1), planPage: String(planPage), metricPage: String(metricPage), limit: String(limit) })}>Próxima</a>}
          </div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createInstagramMetricSnapshot} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>6) Métricas</h3>
          <select name="publicationPlanId" required defaultValue=""><option value="">Selecione um plano</option>{plans.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}</select>
          <select name="metricType" defaultValue="views"><option value="views">views</option><option value="clicks">clicks</option><option value="ctr">ctr</option><option value="saves">saves</option><option value="shares">shares</option><option value="comments">comments</option></select>
          <input name="metricValue" type="number" step="0.01" required />
          <input name="snapshotAt" type="datetime-local" required />
          <button type="submit">Registrar métrica</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Edição/Exclusão de métricas</h3>
          {metrics.map((metric) => (
            <div key={metric.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
              <form action={updateInstagramMetricSnapshot} style={{ display: "grid", gap: 8 }}>
                <input type="hidden" name="id" value={metric.id} />
                <select name="metricType" defaultValue={metric.metricType}><option value="views">views</option><option value="clicks">clicks</option><option value="ctr">ctr</option><option value="saves">saves</option><option value="shares">shares</option><option value="comments">comments</option></select>
                <input name="metricValue" type="number" step="0.01" defaultValue={metric.metricValue} required />
                <input name="snapshotAt" type="datetime-local" defaultValue={toLocalInputValue(metric.snapshotAt)} required />
                <button type="submit">Atualizar métrica</button>
              </form>
              <form action={deleteInstagramMetricSnapshot} style={{ marginTop: 8, display: "grid", gap: 6 }}>
                <input type="hidden" name="id" value={metric.id} />
                <input name="confirm" placeholder="Digite DELETE para excluir" required />
                <button type="submit">Excluir métrica</button>
              </form>
            </div>
          ))}
          <div style={{ display: "flex", gap: 10 }}>
            {metricPage > 1 && <a href={makeQuery({ metricPage: String(metricPage - 1), planPage: String(planPage), logPage: String(logPage), limit: String(limit) })}>Anterior</a>}
            {metricPage * limit < allMetrics.length && <a href={makeQuery({ metricPage: String(metricPage + 1), planPage: String(planPage), logPage: String(logPage), limit: String(limit) })}>Próxima</a>}
          </div>
        </div>
      </div>
    </section>
  );
}
