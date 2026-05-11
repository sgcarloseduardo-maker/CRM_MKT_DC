import { StatusBadge } from "@/components/status/StatusBadge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PublicacoesPlanejamentoPage() {
  const plans = await prisma.publicationPlan.findMany({
    include: { campaign: true, contentBrief: true, logs: true },
    orderBy: { scheduledFor: "asc" },
    take: 100
  });

  return (
    <section>
      <h1>Publicação</h1>
      <p className="muted">Fila, agendamento, status por canal, tracking e logs essenciais.</p>
      <div className="card">
        {plans.length === 0 ? <p className="muted">Sem publicações planejadas.</p> : (
          <div style={{ display: "grid", gap: 10 }}>
            {plans.map((p) => (
              <div key={p.id} className="row-item">
                <div>
                  <strong>{p.title}</strong>
                  <div className="muted">{p.format} - {p.scheduledFor.toLocaleString("pt-BR")} - logs: {p.logs.length}{p.campaign ? ` | projeto: ${p.campaign.name}` : ""}</div>
                  <div className="muted">Tracking: revisar UTM/SubID no conteúdo vinculado antes do envio final.</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
