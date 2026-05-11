import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function RevisaoChecklistPage() {
  const checklists = await prisma.complianceChecklist.findMany({
    include: { campaign: true, contentBrief: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <section>
      <h1>Aprovações</h1>
      <div className="card">
        {checklists.length === 0 ? <p className="muted">Nenhum checklist cadastrado.</p> : (
          <div style={{ display: "grid", gap: 10 }}>
            {checklists.map((c) => (
              <div key={c.id} className="row-item">
                <div>
                  <strong>{c.title}</strong>
                  <div className="muted">{c.campaign ? `campanha: ${c.campaign.name} | ` : ""}{c.contentBrief ? `brief: ${c.contentBrief.title}` : "sem brief"}</div>
                  <div className="muted">Checklist: conteúdo, produto, link e canal</div>
                </div>
                <span className={`badge ${c.isApproved ? "badge-success" : "badge-warn"}`}>{c.isApproved ? "aprovado" : "pendente"}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
