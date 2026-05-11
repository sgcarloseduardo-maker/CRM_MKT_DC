import Link from "next/link";
import { StatusBadge } from "@/components/status/StatusBadge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ContentBlogPage({ params }: { params: { id: string } }) {
  const master = await prisma.contentMaster.findUnique({ where: { id: params.id }, include: { blogDrafts: { orderBy: { createdAt: "desc" } } } });
  if (!master) return <section><h1>Conteúdo não encontrado</h1></section>;

  return (
    <section>
      <h1>Produção do Blog</h1>
      <p className="muted">Conteúdo-mãe: {master.title}</p>
      <div style={{ marginBottom: 16 }}>
        <Link href={`/conteudos-principais/${master.id}`} className="quick-link">Voltar para o hub do conteúdo</Link>
      </div>
      {master.blogDrafts.length === 0 ? (
        <div className="card"><p className="muted">Nenhum rascunho de blog ainda. Crie no detalhe do conteúdo principal.</p></div>
      ) : (
        <div className="grid">
          {master.blogDrafts.map((d) => (
            <div key={d.id} className="card">
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}>
                <h3 style={{ marginTop: 0 }}>{d.seoTitle}</h3>
                <StatusBadge status={d.status} />
              </div>
              <p><strong>H1:</strong> {d.h1}</p>
              <p><strong>Slug:</strong> {d.slug}</p>
              <p className="muted">{d.metaDescription}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
