import Link from "next/link";
import { WorkflowBoard } from "@/components/kanban/WorkflowBoard";
import { StatusBadge } from "@/components/status/StatusBadge";
import { prisma } from "@/lib/prisma";
import {
  createBlogDraftAction,
  createChannelContentAction,
  createCreativeAssetAction,
  generateBlogAiAction,
  generateChannelAiAction,
  generateCreativeAiAction,
  updateBlogDraftAction,
  updateChannelContentAction,
  updateContentMasterAction,
  updateCreativeAssetAction
} from "@/features/content-master/actions";

export const dynamic = "force-dynamic";

const statuses = ["draft", "em_producao", "em_revisao", "aprovado", "publicado", "arquivado"];
const channels = ["Blog", "YouTube", "Instagram Reel", "Instagram Story", "Instagram Feed", "Instagram Carrossel", "Instagram Post Único", "Instagram Vídeo", "TikTok", "Facebook", "WhatsApp", "Telegram", "Site/Blog", "Mercado Livre", "Kwai"];
const okMessageByKey: Record<string, string> = {
  "content-master-criado": "Conteúdo principal criado com sucesso.",
  "content-master-atualizado": "Content Master atualizado com sucesso.",
  "blog-criado": "BlogDraft criado com sucesso.",
  "blog-atualizado": "BlogDraft atualizado com sucesso.",
  "blog-gerado": "Blog gerado com sucesso.",
  "canal-criado": "Conteúdo de canal criado com sucesso.",
  "canal-atualizado": "Conteúdo de canal atualizado com sucesso.",
  "canal-gerado": "Conteúdo de canal gerado com sucesso.",
  "asset-criado": "Asset criativo criado com sucesso.",
  "asset-atualizado": "Asset criativo atualizado com sucesso.",
  "asset-gerado": "Prompt visual gerado com sucesso."
};

export default async function ContentMasterDetailPage({ params, searchParams }: { params: { id: string }; searchParams?: { ok?: string } }) {
  const item = await prisma.contentMaster.findUnique({
    where: { id: params.id },
    include: { blogDrafts: { orderBy: { createdAt: "desc" } }, channelContents: { orderBy: { createdAt: "desc" } }, creativeAssets: { orderBy: { createdAt: "desc" } } }
  });
  if (!item) return <section><h1>Conteúdo principal não encontrado</h1></section>;

  return (
    <section>
      <h1>{item.title}</h1>
      {searchParams?.ok && okMessageByKey[searchParams.ok] ? <p className="alert alert-success">{okMessageByKey[searchParams.ok]}</p> : null}
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <StatusBadge status={item.status} />
        <span className="muted">{item.mainProduct} vs {item.mainCompetitor}</span>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Ações rápidas de geração assistida</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <form action={generateBlogAiAction}><input type="hidden" name="contentMasterId" value={item.id} /><button type="submit">Gerar blog</button></form>
          <form action={generateChannelAiAction}><input type="hidden" name="contentMasterId" value={item.id} /><input type="hidden" name="channelType" value="YouTube" /><button type="submit">Gerar roteiro YouTube</button></form>
          <form action={generateChannelAiAction}><input type="hidden" name="contentMasterId" value={item.id} /><input type="hidden" name="channelType" value="Instagram Reel" /><button type="submit">Gerar copy Reel</button></form>
          <form action={generateCreativeAiAction}><input type="hidden" name="contentMasterId" value={item.id} /><button type="submit">Gerar prompt visual</button></form>
        </div>
      </div>

      <form action={updateContentMasterAction} className="card" style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Dados principais da pauta</h3>
        <input type="hidden" name="id" value={item.id} />
        <input name="title" defaultValue={item.title} required />
        <div className="grid">
          <input name="category" defaultValue={item.category} />
          <input name="mainProduct" defaultValue={item.mainProduct} />
          <input name="mainCompetitor" defaultValue={item.mainCompetitor} />
          <input name="mainBrand" defaultValue={item.mainBrand} />
          <input name="competitorBrand" defaultValue={item.competitorBrand} />
          <input name="primaryKeyword" defaultValue={item.primaryKeyword} />
          <input name="secondaryKeywords" defaultValue={item.secondaryKeywords} />
          <input name="intent" defaultValue={item.intent} />
          <input name="funnelLevel" defaultValue={item.funnelLevel} />
          <select name="status" defaultValue={item.status}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        </div>
        <textarea name="editorialSummary" defaultValue={item.editorialSummary} rows={2} />
        <textarea name="valueProposition" defaultValue={item.valueProposition} rows={2} />
        <textarea name="advantages" defaultValue={item.advantages} rows={2} />
        <textarea name="disadvantages" defaultValue={item.disadvantages} rows={2} />
        <textarea name="whereToUse" defaultValue={item.whereToUse} rows={2} />
        <textarea name="whereNotToUse" defaultValue={item.whereNotToUse} rows={2} />
        <textarea name="technicalAssessment" defaultValue={item.technicalAssessment} rows={2} />
        <textarea name="commonFailureParts" defaultValue={item.commonFailureParts} rows={2} />
        <textarea name="preventiveMaintenance" defaultValue={item.preventiveMaintenance} rows={2} />
        <textarea name="durabilityCare" defaultValue={item.durabilityCare} rows={2} />
        <textarea name="finalDecision" defaultValue={item.finalDecision} rows={2} />
        <input name="mainCta" defaultValue={item.mainCta} />
        <textarea name="affiliateLinksJson" defaultValue={item.affiliateLinksJson} rows={2} />
        <input name="youtubeLinks" defaultValue={item.youtubeLinks || ""} />
        <input name="blogLinks" defaultValue={item.blogLinks || ""} />
        <input name="socialLinks" defaultValue={item.socialLinks || ""} />
        <button type="submit">Salvar Content Master</button>
      </form>

      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createBlogDraftAction} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Blog (criar)</h3>
          <input type="hidden" name="contentMasterId" value={item.id} />
          <input name="seoTitle" placeholder="Título SEO" required />
          <input name="h1" placeholder="H1" required />
          <input name="slug" placeholder="slug" />
          <textarea name="introduction" rows={2} placeholder="Introdução" />
          <select name="status" defaultValue="draft">{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <button type="submit">Criar BlogDraft</button>
        </form>

        <form action={createChannelContentAction} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Canal (criar)</h3>
          <input type="hidden" name="contentMasterId" value={item.id} />
          <select name="channelType" defaultValue={channels[0]}>{channels.map((c) => <option key={c} value={c}>{c}</option>)}</select>
          <input name="format" placeholder="Formato" required />
          <input name="objective" placeholder="Objetivo" />
          <input name="hook" placeholder="Hook" />
          <textarea name="copy" rows={2} placeholder="Copy" />
          <input name="cta" placeholder="CTA" />
          <select name="productionStatus" defaultValue="draft">{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <button type="submit">Criar ChannelContent</button>
        </form>
      </div>

      <form action={createCreativeAssetAction} className="card" style={{ marginTop: 16, display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Artes (criar)</h3>
        <input type="hidden" name="contentMasterId" value={item.id} />
        <select name="channelContentId" defaultValue=""><option value="">Sem vínculo</option>{item.channelContents.map((c) => <option key={c.id} value={c.id}>{c.channelType} - {c.format}</option>)}</select>
        <input name="title" placeholder="Título da arte" required />
        <input name="headline" placeholder="Headline" />
        <input name="subheadline" placeholder="Subheadline" />
        <input name="visualCta" placeholder="CTA visual" />
        <textarea name="artText" rows={2} placeholder="Texto da arte" />
        <input name="visualDirection" placeholder="Orientação visual" />
        <input name="visualStyle" placeholder="Estilo visual" />
        <input name="ratioFormat" placeholder="Formato" />
        <textarea name="imagePrompt" rows={2} placeholder="Prompt de imagem" />
        <textarea name="variationPrompt" rows={2} placeholder="Prompt variação" />
        <select name="artStatus" defaultValue="draft">{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
        <button type="submit">Criar CreativeAsset</button>
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Edição completa - BlogDraft</h3>
        {item.blogDrafts.length === 0 ? <p className="muted">Sem blog drafts.</p> : item.blogDrafts.map((b) => (
          <form key={b.id} action={updateBlogDraftAction} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 8, display: "grid", gap: 6 }}>
            <input type="hidden" name="id" value={b.id} />
            <input type="hidden" name="contentMasterId" value={item.id} />
            <input name="seoTitle" defaultValue={b.seoTitle} />
            <input name="metaDescription" defaultValue={b.metaDescription} />
            <input name="slug" defaultValue={b.slug} />
            <input name="h1" defaultValue={b.h1} />
            <textarea name="introduction" defaultValue={b.introduction} rows={2} />
            <textarea name="h2h3Blocks" defaultValue={b.h2h3Blocks} rows={2} />
            <textarea name="technicalComparison" defaultValue={b.technicalComparison} rows={2} />
            <textarea name="advantagesDisadvantages" defaultValue={b.advantagesDisadvantages} rows={2} />
            <textarea name="usageGuide" defaultValue={b.usageGuide} rows={2} />
            <textarea name="maintenanceGuide" defaultValue={b.maintenanceGuide} rows={2} />
            <textarea name="wearParts" defaultValue={b.wearParts} rows={2} />
            <textarea name="finalConclusion" defaultValue={b.finalConclusion} rows={2} />
            <textarea name="faq" defaultValue={b.faq} rows={2} />
            <textarea name="affiliateLinksBlock" defaultValue={b.affiliateLinksBlock} rows={2} />
            <textarea name="youtubeBlock" defaultValue={b.youtubeBlock} rows={2} />
            <textarea name="socialLinksBlock" defaultValue={b.socialLinksBlock} rows={2} />
            <select name="status" defaultValue={b.status}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            <button type="submit">Salvar BlogDraft</button>
          </form>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Edição completa - ChannelContent</h3>
        {item.channelContents.length === 0 ? <p className="muted">Sem conteúdos de canal.</p> : item.channelContents.map((c) => (
          <form key={c.id} action={updateChannelContentAction} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 8, display: "grid", gap: 6 }}>
            <input type="hidden" name="id" value={c.id} />
            <input type="hidden" name="contentMasterId" value={item.id} />
            <select name="channelType" defaultValue={c.channelType}>{channels.map((ch) => <option key={ch} value={ch}>{ch}</option>)}</select>
            <input name="objective" defaultValue={c.objective} />
            <input name="format" defaultValue={c.format} />
            <input name="hook" defaultValue={c.hook} />
            <textarea name="copy" defaultValue={c.copy} rows={2} />
            <textarea name="caption" defaultValue={c.caption} rows={2} />
            <input name="cta" defaultValue={c.cta} />
            <input name="keywords" defaultValue={c.keywords} />
            <input name="hashtags" defaultValue={c.hashtags} />
            <textarea name="visualPrompt" defaultValue={c.visualPrompt} rows={2} />
            <textarea name="copyPrompt" defaultValue={c.copyPrompt} rows={2} />
            <textarea name="videoPrompt" defaultValue={c.videoPrompt} rows={2} />
            <textarea name="artSpec" defaultValue={c.artSpec} rows={2} />
            <textarea name="strategicNotes" defaultValue={c.strategicNotes} rows={2} />
            <select name="productionStatus" defaultValue={c.productionStatus}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            <select name="publicationStatus" defaultValue={c.publicationStatus}><option value="pending">pending</option><option value="published">published</option><option value="error">error</option><option value="cancelled">cancelled</option></select>
            <button type="submit">Salvar ChannelContent</button>
          </form>
        ))}
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Edição completa - CreativeAsset</h3>
        {item.creativeAssets.length === 0 ? <p className="muted">Sem assets.</p> : item.creativeAssets.map((a) => (
          <form key={a.id} action={updateCreativeAssetAction} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 8, display: "grid", gap: 6 }}>
            <input type="hidden" name="id" value={a.id} />
            <input type="hidden" name="contentMasterId" value={item.id} />
            <input name="title" defaultValue={a.title} />
            <input name="headline" defaultValue={a.headline} />
            <input name="subheadline" defaultValue={a.subheadline} />
            <input name="visualCta" defaultValue={a.visualCta} />
            <textarea name="artText" defaultValue={a.artText} rows={2} />
            <input name="visualDirection" defaultValue={a.visualDirection} />
            <input name="visualStyle" defaultValue={a.visualStyle} />
            <input name="ratioFormat" defaultValue={a.ratioFormat} />
            <input name="coverReference" defaultValue={a.coverReference || ""} />
            <textarea name="imagePrompt" defaultValue={a.imagePrompt} rows={2} />
            <textarea name="variationPrompt" defaultValue={a.variationPrompt} rows={2} />
            <select name="artStatus" defaultValue={a.artStatus}>{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
            <input name="finalApprovedVersion" defaultValue={a.finalApprovedVersion || ""} />
            <button type="submit">Salvar CreativeAsset</button>
          </form>
        ))}
      </div>

      <div className="grid" style={{ marginTop: 16 }}>
        <WorkflowBoard
          title="Workflow - Blog"
          items={item.blogDrafts.map((b) => ({ id: b.id, title: b.seoTitle, status: b.status, subtitle: b.slug }))}
        />
        <WorkflowBoard
          title="Workflow - Canais"
          items={item.channelContents.map((c) => ({ id: c.id, title: `${c.channelType} • ${c.format}`, status: c.productionStatus, subtitle: c.publicationStatus }))}
        />
      </div>

      <div style={{ marginTop: 16 }}>
        <WorkflowBoard
          title="Workflow - Artes"
          items={item.creativeAssets.map((a) => ({ id: a.id, title: a.title, status: a.artStatus, subtitle: a.ratioFormat }))}
        />
      </div>

      <div className="card" style={{ marginTop: 16, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Link href={`/conteudos-principais/${item.id}/blog`} className="quick-link">Tela de produção do blog</Link>
        <Link href={`/conteudos-principais/${item.id}/canais`} className="quick-link">Tela de produção por canal</Link>
        <Link href="/conteudos-principais" className="quick-link">Voltar para lista de pautas</Link>
      </div>
    </section>
  );
}
