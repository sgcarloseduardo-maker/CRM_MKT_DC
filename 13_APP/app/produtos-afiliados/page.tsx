import { prisma } from "@/lib/prisma";
import { confirmDetectedProductLink } from "@/features/affiliate-products/actions";

export const dynamic = "force-dynamic";

export default async function ProdutosAfiliadosPage({ searchParams }: { searchParams?: { contentMasterId?: string } }) {
  const where = searchParams?.contentMasterId ? { id: searchParams.contentMasterId } : undefined;
  const masters = await prisma.contentMaster.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 10
  });
  const extractedRaw = masters.flatMap((m) => [m.mainProduct, m.mainCompetitor].filter(Boolean).map((name) => ({ sourceId: m.id, sourceTitle: m.title, name })));
  const extracted = extractedRaw.filter((item, idx, arr) => arr.findIndex((a) => a.sourceId === item.sourceId && a.name === item.name) === idx);

  return (
    <section>
      <h1>Produtos</h1>
      <p className="muted">Fluxo principal: produtos encontrados no conteúdo e confirmação de link afiliado por produto.</p>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Produtos detectados do conteúdo</h3>
        {extracted.length === 0 ? (
          <p className="muted">Nenhum produto detectado nos conteúdos recentes.</p>
        ) : (
          <div style={{ display: "grid", gap: 8 }}>
            {extracted.slice(0, 20).map((item, i) => {
              const query = encodeURIComponent(item.name);
              return (
              <div key={`${item.sourceId}-${i}`} className="card" style={{ padding: 12 }}>
                <div>
                  <strong>{item.name}</strong>
                  <div className="muted">Origem: {item.sourceTitle}</div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                  <a className="quick-link" href={`https://www.mercadolivre.com.br/`} target="_blank" rel="noreferrer">Mercado Livre</a>
                  <a className="quick-link" href={`https://shopee.com.br/search?keyword=${query}`} target="_blank" rel="noreferrer">Shopee</a>
                  <a className="quick-link" href={`https://www.tiktok.com/search?q=${query}`} target="_blank" rel="noreferrer">TikTok</a>
                  <a className="quick-link" href={`https://www.amazon.com.br/s?k=${query}`} target="_blank" rel="noreferrer">Amazon</a>
                  <a className="quick-link" href={`https://www.lojadomecanico.com.br/busca/${query}`} target="_blank" rel="noreferrer">Loja do Mecânico</a>
                  <a className="quick-link" href={`https://www.lojaskennedy.com.br/busca?q=${query}`} target="_blank" rel="noreferrer">Lojas Kennedy</a>
                </div>
                <form action={confirmDetectedProductLink} style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                  <input type="hidden" name="contentMasterId" value={item.sourceId} />
                  <input type="hidden" name="productName" value={item.name} />
                  <input name="affiliateUrl" placeholder="Cole o link afiliado escolhido" style={{ minWidth: 320, flex: 1 }} required />
                  <button type="submit">Confirmar</button>
                </form>
              </div>
            );})}
          </div>
        )}
      </div>
    </section>
  );
}
