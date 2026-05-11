import Link from "next/link";
import { StatusBadge } from "@/components/status/StatusBadge";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AssetsArtesPage() {
  const assets = await prisma.creativeAsset.findMany({
    include: { contentMaster: true, channelContent: true },
    orderBy: { createdAt: "desc" },
    take: 100
  });

  return (
    <section>
      <h1>Biblioteca Criativa</h1>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Tipos de criativos por rede</h3>
        <div className="grid">
          <div><strong>Blog/Site</strong><div className="muted">Banner, imagem de apoio, comparativo visual</div></div>
          <div><strong>YouTube</strong><div className="muted">Thumbnail, vídeo review, vídeo comparativo</div></div>
          <div><strong>Instagram</strong><div className="muted">Feed, carrossel, stories de oferta, reels</div></div>
          <div><strong>TikTok</strong><div className="muted">Vídeo crescimento, vídeo conversão, TikTok Shop</div></div>
          <div><strong>Facebook</strong><div className="muted">Post, imagem com CTA, vídeo curto</div></div>
          <div><strong>Kwai</strong><div className="muted">Vídeo curto</div></div>
          <div><strong>Mercado Livre</strong><div className="muted">Imagem de oferta, texto comercial curto</div></div>
          <div><strong>Shopee</strong><div className="muted">Imagem promocional, texto curto de conversão</div></div>
          <div><strong>WhatsApp/Telegram</strong><div className="muted">Arte de oferta, texto curto, CTA rápido</div></div>
        </div>
      </div>
      <div className="card">
        {assets.length === 0 ? (
          <p className="muted">Nenhum asset cadastrado.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {assets.map((a) => (
              <div key={a.id} className="row-item">
                <div>
                  <strong>{a.title}</strong>
                  <div className="muted">{a.ratioFormat} - {a.contentMaster.title}{a.channelContent ? ` (${a.channelContent.channelType})` : ""}</div>
                </div>
                <StatusBadge status={a.artStatus} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginTop: 12 }}>
        <Link href="/conteudos-principais" className="quick-link">Ir para Conteúdo Principal</Link>
      </div>
    </section>
  );
}
