import Link from "next/link";
import { StatusBadge } from "@/components/status/StatusBadge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ContentChannelsPage({ params }: { params: { id: string } }) {
  const master = await prisma.contentMaster.findUnique({
    where: { id: params.id },
    include: { channelContents: { orderBy: { createdAt: "desc" } } }
  });
  if (!master) return <section><h1>Conteúdo não encontrado</h1></section>;

  return (
    <section>
      <h1>Produção por Canal</h1>
      <p className="muted">Estratégia própria por canal para: {master.title}</p>
      <div style={{ marginBottom: 16 }}>
        <Link href={`/conteudos-principais/${master.id}`} className="quick-link">Voltar para o hub do conteúdo</Link>
      </div>
      {master.channelContents.length === 0 ? (
        <div className="card"><p className="muted">Nenhum conteúdo por canal cadastrado.</p></div>
      ) : (
        <div className="grid">
          {master.channelContents.map((c) => (
            <div key={c.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <h3 style={{ marginTop: 0 }}>{c.channelType}</h3>
                <StatusBadge status={c.productionStatus} />
              </div>
              <p><strong>Formato:</strong> {c.format}</p>
              <p><strong>Objetivo:</strong> {c.objective}</p>
              <p><strong>Hook:</strong> {c.hook}</p>
              <p><strong>CTA:</strong> {c.cta}</p>
              <p className="muted">Status: {c.productionStatus} / {c.publicationStatus}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
