import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { updateBlogDraftAction } from "@/features/content-master/actions";

export const dynamic = "force-dynamic";

export default async function RefinoSeoPage({ searchParams }: { searchParams?: { contentMasterId?: string } }) {
  const where = searchParams?.contentMasterId ? { id: searchParams.contentMasterId } : undefined;
  const masters = await prisma.contentMaster.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { blogDrafts: { orderBy: { createdAt: "desc" } } }
  });

  return (
    <section>
      <h1>Refino SEO</h1>
      <p className="muted">Refine o conteúdo base, confirme headings/meta/keywords e valide a versão final-mestre.</p>

      {masters.length === 0 ? (
        <div className="card" style={{ marginTop: 16 }}>
          <p className="muted">Nenhum conteúdo disponível para refino.</p>
          <Link href="/conteudos-principais">Ir para Gerador de Conteúdo</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 12, marginTop: 16 }}>
          {masters.map((m) => {
            const draft = m.blogDrafts[0];
            return (
              <div key={m.id} className="card" style={{ display: "grid", gap: 8 }}>
                <h3 style={{ margin: 0 }}>{m.title}</h3>
                <div className="muted">Original: {m.editorialSummary.slice(0, 220) || "Sem resumo"}</div>

                {draft ? (
                  <form action={updateBlogDraftAction} style={{ display: "grid", gap: 12 }}>
                    <input type="hidden" name="id" value={draft.id} />
                    <input type="hidden" name="contentMasterId" value={m.id} />
                    <label>
                      <strong>Artigo refinado (editável)</strong>
                      <textarea
                        name="introduction"
                        defaultValue={draft.introduction || m.editorialSummary}
                        rows={24}
                        placeholder="Artigo completo pronto para blog"
                        required
                      />
                    </label>
                    <label>
                      <strong>Recomendações de melhoria fina</strong>
                      <textarea
                        name="usageGuide"
                        defaultValue={draft.usageGuide || "Sem recomendações adicionais no momento."}
                        rows={8}
                        placeholder="Sugestões ponto a ponto para enriquecer o texto final"
                      />
                    </label>
                    <select name="status" defaultValue={draft.status}>
                      <option value="draft">Rascunho</option>
                      <option value="em_producao">Em produção</option>
                      <option value="em_revisao">Em revisão</option>
                      <option value="aprovado">Aprovado (versão final-mestre)</option>
                    </select>
                    <button type="submit">Confirmar versão refinada</button>
                  </form>
                ) : (
                  <p className="muted">Sem rascunho de blog para este conteúdo.</p>
                )}

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <Link href={`/conteudos-principais/${m.id}`}>Voltar para conteúdo</Link>
                  <Link href="/produtos-afiliados">Seguir para Produtos</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
