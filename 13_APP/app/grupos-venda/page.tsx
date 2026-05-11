import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function GruposVendaPage() {
  const master = await prisma.contentMaster.findFirst({ orderBy: { createdAt: "desc" } });
  const product = await prisma.affiliateProduct.findFirst({ where: { isPriority: true }, orderBy: { createdAt: "desc" } });
  const cta = master?.mainCta || "Confira o comparativo";
  const link = product?.affiliateUrl || "(defina o link aprovado em Produtos)";

  return (
    <section>
      <h1>Grupos de Venda</h1>
      <p className="muted">Mensagens curtas para WhatsApp e Telegram, com CTA rápido e link rastreável.</p>

      <div className="grid" style={{ marginTop: 16 }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>WhatsApp</h3>
          <textarea
            rows={5}
            readOnly
            value={`Produto em destaque: ${product?.name || "produto não definido"}\n${master?.title || "conteúdo base pendente"}\nCTA: ${cta}\nLink: ${link}`}
          />
          <div className="muted">Variação curta: "Resumo direto + benefício + CTA"</div>
        </div>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Telegram</h3>
          <textarea
            rows={5}
            readOnly
            value={`Achado do dia: ${product?.name || "produto não definido"}\nComparação rápida disponível\nCTA: ${cta}\nLink: ${link}`}
          />
          <div className="muted">Variação curta: "gancho + ponto de decisão + link"</div>
        </div>
      </div>
    </section>
  );
}
