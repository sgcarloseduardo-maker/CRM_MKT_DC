"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type ContentMasterData = {
  id: string;
  title: string;
  mainCta: string;
  editorialSummary: string;
  primaryKeyword: string;
  secondaryKeywords: string;
  finalDecision: string;
  mainProduct: string;
  mainCompetitor: string;
  mainBrand: string;
  status: string;
  affiliateLinksJson: string;
} | null;

type AffiliateProductData = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  notes: string | null;
  affiliateUrl: string | null;
}[];

type ChannelContentData = {
  id: string;
  channelType: string;
  copy: string;
  caption: string;
  cta: string;
  hashtags: string;
  keywords: string;
  productionStatus: string;
}[];

type SocialKey = "blog" | "youtube" | "instagram" | "tiktok" | "mercado-livre" | "shopee" | "facebook" | "kwai";

type ProductDraft = {
  id: string;
  name: string;
  brand: string;
  model: string;
  voltage: string;
  description: string;
  affiliateLink: string;
};

const networkConfig: Record<SocialKey, { label: string; formats: string[]; tone: string }> = {
  blog: { label: "Blog/Site", formats: ["Banner", "Imagem de apoio", "Comparativo visual", "Imagem destacada do artigo"], tone: "article" },
  youtube: { label: "YouTube", formats: ["Thumbnail", "Short", "Vídeo médio", "Vídeo longo", "Post da comunidade"], tone: "review" },
  instagram: { label: "Instagram", formats: ["Reels", "Feed Imagem", "Feed Carrossel", "Feed Vídeo", "Stories"], tone: "social" },
  tiktok: { label: "TikTok", formats: ["TikTok Crescimento", "TikTok Shop", "Vídeo curto de oferta", "Vídeo curto comparativo"], tone: "short" },
  "mercado-livre": { label: "Mercado Livre", formats: ["Card de oferta", "Imagem de produto", "Comparativo visual simples"], tone: "commercial" },
  shopee: { label: "Shopee", formats: ["Card promocional", "Imagem de produto", "Oferta curta visual"], tone: "commercial" },
  facebook: { label: "Facebook", formats: ["Post imagem", "Carrossel", "Vídeo", "Story/Status"], tone: "mid" },
  kwai: { label: "Kwai", formats: ["Vídeo curto", "Card visual de apoio"], tone: "short" }
};

function normalizeVoltage(text: string): string {
  const found = text.match(/\b(110v|127v|220v|bivolt|12v|18v|20v)\b/i);
  return found ? found[0].toUpperCase() : "";
}

function networkPrefix(tab: SocialKey): string {
  if (tab === "instagram") return "Instagram";
  if (tab === "youtube") return "YouTube";
  if (tab === "blog") return "Blog/Site";
  if (tab === "tiktok") return "TikTok";
  if (tab === "facebook") return "Facebook";
  if (tab === "kwai") return "Kwai";
  if (tab === "mercado-livre") return "Mercado Livre";
  return "Shopee";
}

function buildCaption(tab: SocialKey, baseText: string, cta: string, hashtags: string): string {
  if (tab === "instagram") return `${baseText}\n\nCTA: ${cta}\n\n${hashtags}`;
  if (tab === "youtube") return `${baseText}\n\nComparativo completo e prático para decisão final.\nCTA: ${cta}\n\n${hashtags}`;
  if (tab === "blog") return `${baseText}\n\nEstrutura para artigo com contexto técnico e conclusão objetiva.\nCTA: ${cta}`;
  if (tab === "tiktok") return `${baseText}\n\nDireto ao ponto. ${cta}`;
  if (tab === "facebook") return `${baseText}\n\nResumo com prova social e chamada para ação.\nCTA: ${cta}`;
  if (tab === "mercado-livre" || tab === "shopee") return `${baseText}\n\nOferta objetiva e benefícios centrais.\nCTA: ${cta}`;
  return `${baseText}\n\nCopy curta, direta e conversão.\nCTA: ${cta}`;
}

export function SocialOperationalPanel({
  master,
  products,
  channelContents,
  initialTab
}: {
  master: ContentMasterData;
  products: AffiliateProductData;
  channelContents: ChannelContentData;
  initialTab: SocialKey;
}) {
  const [activeTab, setActiveTab] = useState<SocialKey>(initialTab);
  const [copied, setCopied] = useState(false);

  const hasSeoData = Boolean(master?.title && master?.finalDecision);

  const parsedLinks = useMemo(() => {
    if (!master?.affiliateLinksJson) return {} as Record<string, string>;
    try {
      return JSON.parse(master.affiliateLinksJson) as Record<string, string>;
    } catch {
      return {} as Record<string, string>;
    }
  }, [master?.affiliateLinksJson]);

  const matchedChannel = useMemo(() => {
    const tabName = networkPrefix(activeTab).toLowerCase();
    return channelContents.find((item) => item.channelType.toLowerCase().includes(tabName)) || channelContents[0];
  }, [activeTab, channelContents]);

  const initialProducts = useMemo<ProductDraft[]>(() => {
    if (!master) return [];
    const names = [master.mainProduct, master.mainCompetitor].filter(Boolean);
    const fromDb = products.filter((p) => names.some((name) => p.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(p.name.toLowerCase())));
    const fallback = names.map((name, i) => ({
      id: `fallback-${i}`,
      name,
      brand: i === 0 ? master.mainBrand : "",
      category: "",
      notes: "",
      affiliateUrl: ""
    }));
    const merged = (fromDb.length > 0 ? fromDb : fallback).slice(0, 4);
    return merged.map((p, index) => {
      const description = p.notes || p.category || master.editorialSummary || "Descrição curta do produto";
      const model = p.name.replace((p.brand || "").trim(), "").trim() || p.name;
      const affiliateLink = p.affiliateUrl || Object.values(parsedLinks)[index] || Object.values(parsedLinks)[0] || "";
      return {
        id: p.id,
        name: p.name,
        brand: p.brand || (index === 0 ? master.mainBrand : ""),
        model,
        voltage: normalizeVoltage(`${p.name} ${description}`),
        description,
        affiliateLink
      };
    });
  }, [master, parsedLinks, products]);

  const [caption, setCaption] = useState(() => {
    const baseText = matchedChannel?.caption || matchedChannel?.copy || master?.editorialSummary || "";
    const cta = matchedChannel?.cta || master?.mainCta || "";
    const hashtags = matchedChannel?.hashtags || `#${(master?.primaryKeyword || "oferta").replace(/\s+/g, "")} ${(master?.secondaryKeywords || "").split(",").map((k) => `#${k.trim().replace(/\s+/g, "")}`).join(" ")}`;
    return buildCaption(initialTab, baseText, cta, hashtags.trim());
  });

  const [productDrafts, setProductDrafts] = useState<ProductDraft[]>(initialProducts);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [artworks, setArtworks] = useState<Array<{ id: string; format: string; dataUrl: string }>>([]);

  const currentConfig = networkConfig[activeTab];
  const adaptationStatus = matchedChannel?.productionStatus || (hasSeoData ? "pronto para adaptação" : "aguardando SEO");

  const refreshTabData = (tab: SocialKey) => {
    const tabName = networkPrefix(tab).toLowerCase();
    const channel = channelContents.find((item) => item.channelType.toLowerCase().includes(tabName)) || channelContents[0];
    const baseText = channel?.caption || channel?.copy || master?.editorialSummary || "";
    const cta = channel?.cta || master?.mainCta || "";
    const hashtags = channel?.hashtags || `#${(master?.primaryKeyword || "oferta").replace(/\s+/g, "")}`;
    setCaption(buildCaption(tab, baseText, cta, hashtags.trim()));
    setSelectedFormats([]);
    setArtworks([]);
    setCopied(false);
  };

  const copyCaption = async () => {
    await navigator.clipboard.writeText(caption);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const generateArtwork = () => {
    if (selectedFormats.length === 0) return;
    const generated = selectedFormats.map((format) => {
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1080'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='#113e66'/><stop offset='100%' stop-color='#0f4c81'/></linearGradient></defs><rect width='100%' height='100%' fill='url(#g)'/><rect x='40' y='40' width='1000' height='1000' rx='24' fill='rgba(255,255,255,0.08)'/><text x='80' y='140' font-family='Montserrat,Segoe UI,sans-serif' font-size='52' fill='white'>${currentConfig.label}</text><text x='80' y='220' font-family='Montserrat,Segoe UI,sans-serif' font-size='42' fill='#f4b400'>${format}</text><text x='80' y='320' font-family='Montserrat,Segoe UI,sans-serif' font-size='28' fill='white'>${(master?.title || "Sem título aprovado").slice(0, 85)}</text><text x='80' y='420' font-family='Montserrat,Segoe UI,sans-serif' font-size='24' fill='#dbeafe'>${caption.slice(0, 110).replace(/</g, "")}</text></svg>`;
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
      return { id: `${activeTab}-${format}`, format, dataUrl };
    });
    setArtworks(generated);
  };

  const updateProduct = (id: string, field: keyof ProductDraft, value: string) => {
    setProductDrafts((prev) => prev.map((product) => (product.id === id ? { ...product, [field]: value } : product)));
  };

  return (
    <section className="social-panel-page">
      <h1>Redes Sociais</h1>
      <p className="muted">Painel operacional de adaptação por rede com dados da decisão final do SEO.</p>

      <div className="card social-tabs-card" style={{ marginTop: 16 }}>
        <div className="social-tabs" role="tablist" aria-label="Abas principais de redes sociais">
          {(Object.keys(networkConfig) as SocialKey[]).map((tab) => (
            <button
              key={tab}
              type="button"
              className={`social-tab ${tab === activeTab ? "active" : ""}`}
              role="tab"
              aria-selected={tab === activeTab}
              onClick={() => {
                setActiveTab(tab);
                refreshTabData(tab);
              }}
            >
              {networkConfig[tab].label}
            </button>
          ))}
        </div>
      </div>

      {!hasSeoData ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 style={{ marginTop: 0 }}>Sem dados aprovados do SEO</h3>
          <p className="muted">Finalize o fluxo SEO e confirme conteúdo, produtos e link afiliado para habilitar o preenchimento automático das abas.</p>
        </div>
      ) : null}

      <div className="social-columns" style={{ marginTop: 16 }}>
        <div className="card social-form-panel">
          <h3 style={{ marginTop: 0 }}>{currentConfig.label} - Edição de Conteúdo</h3>
          <div className="muted">Status da adaptação: {adaptationStatus}</div>

          <label className="social-field-label">
            Legenda
            <textarea className="social-caption" value={caption} onChange={(e) => setCaption(e.target.value)} rows={10} placeholder="Legenda pré-preenchida após SEO" />
          </label>

          <div className="social-actions-row">
            <button type="button" className="btn-secondary" onClick={copyCaption}>Copiar texto</button>
            {copied ? <span className="badge badge-success">Copiado com sucesso</span> : null}
          </div>

          {productDrafts.length === 0 ? <div className="alert">Nenhum produto reconhecido para este conteúdo.</div> : null}
          {productDrafts.map((product, idx) => (
            <div key={product.id} className="social-product-block">
              <strong>Produto {idx + 1}</strong>
              <input value={product.name} onChange={(e) => updateProduct(product.id, "name", e.target.value)} placeholder="Nome do produto" />
              <div className="social-product-grid">
                <input value={product.brand} onChange={(e) => updateProduct(product.id, "brand", e.target.value)} placeholder="Marca" />
                <input value={product.model} onChange={(e) => updateProduct(product.id, "model", e.target.value)} placeholder="Modelo" />
                <input value={product.voltage} onChange={(e) => updateProduct(product.id, "voltage", e.target.value)} placeholder="Voltagem" />
              </div>
              <textarea value={product.description} onChange={(e) => updateProduct(product.id, "description", e.target.value)} rows={3} placeholder="Descrição curta" />
              <input value={product.affiliateLink} onChange={(e) => updateProduct(product.id, "affiliateLink", e.target.value)} placeholder="Link afiliado aprovado" />
            </div>
          ))}
        </div>

        <div className="card social-art-panel">
          <h3 style={{ marginTop: 0 }}>Tipo de Postagem</h3>
          <div className="social-checkboxes">
            {currentConfig.formats.map((format) => (
              <label key={format} className="social-checkbox-item">
                <input
                  type="checkbox"
                  checked={selectedFormats.includes(format)}
                  onChange={(e) => {
                    setSelectedFormats((prev) => (e.target.checked ? [...prev, format] : prev.filter((item) => item !== format)));
                  }}
                />
                {format}
              </label>
            ))}
          </div>

          <button type="button" className="btn-primary" onClick={generateArtwork} disabled={selectedFormats.length === 0}>GERAR ARTE</button>

          <div className="social-artworks">
            {artworks.length === 0 ? <div className="muted">Selecione formatos e clique em GERAR ARTE para criar miniaturas.</div> : null}
            {artworks.map((art) => (
              <div key={art.id} className="social-art-item">
                <strong>{art.format}</strong>
                <img src={art.dataUrl} alt={`Miniatura ${art.format}`} className="social-art-preview" />
                <a href={art.dataUrl} download={`${activeTab}-${art.format.toLowerCase().replace(/\s+/g, "-")}.svg`}>
                  <span className="social-download-link">Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link href="/grupos-venda">Seguir para Grupos de Venda</Link>
      </div>
    </section>
  );
}
