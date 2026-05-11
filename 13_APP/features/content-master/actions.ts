"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { writeAuditLog } from "@/features/audit/log";

function str(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function strOrNull(formData: FormData, key: string) {
  if (!formData.has(key)) return null;
  return String(formData.get(key) || "").trim();
}

const stopWords = new Set([
  "de", "da", "do", "das", "dos", "e", "a", "o", "as", "os", "em", "um", "uma", "para", "com", "por", "na", "no", "nas", "nos", "que", "como", "mais", "menos", "sem", "sobre", "entre", "ao", "aos", "ou", "se", "sua", "seu", "suas", "seus", "este", "esta", "isso", "essa", "esse", "tambem", "ate", "ja", "muito", "pouco"
]);

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function extractFrequentTerms(rawText: string, max = 8) {
  const counts = new Map<string, number>();
  const words = normalizeText(rawText).match(/[a-z0-9]{4,}/g) || [];

  for (const word of words) {
    if (stopWords.has(word)) continue;
    counts.set(word, (counts.get(word) || 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, max)
    .map(([term]) => term);
}

function extractQuestions(rawText: string) {
  return rawText
    .split(/\n+/)
    .map((line) => line.trim())
    .filter((line) => /\?$/.test(line) || /^(como|qual|quais|vale|compensa|quando|onde)/i.test(line))
    .slice(0, 6);
}

function buildSeoAnalystDraft(rawText: string, title: string, mainProduct: string, mainCompetitor: string, pdfName: string) {
  const terms = extractFrequentTerms(rawText);
  const questions = extractQuestions(rawText);
  const textSource = rawText || `Conteudo importado de PDF: ${pdfName}`;
  const firstParagraph = textSource.split(/\n{2,}/)[0].slice(0, 520);
  const secondaryKeywords = terms.filter((term) => !mainProduct.toLowerCase().includes(term)).slice(0, 6).join(", ");
  const faq = questions.length
    ? questions.map((q) => `- ${q.endsWith("?") ? q : `${q}?`}`).join("\n")
    : [
        `- ${mainProduct} e ${mainCompetitor}: qual entrega melhor custo-beneficio?`,
        `- Qual opcao e mais segura para uso recorrente?`,
        "- O que deve ser observado antes de comprar pelo link afiliado?"
      ].join("\n");

  const recommendation = [
    `Contexto real de uso para ${mainProduct}.`,
    `Comparativo objetivo entre ${mainProduct} e ${mainCompetitor}.`,
    "Pontos tecnicos, risco de compra errada e recomendacao final baseada em perfil."
  ];

  const blogArticle = [
    `# ${title}`,
    "",
    "## Introducao",
    firstParagraph,
    "",
    `## ${mainProduct} vs ${mainCompetitor}: qual escolher?`,
    `Quando o comprador compara ${mainProduct} com ${mainCompetitor}, o erro mais comum e decidir apenas por preco. O criterio correto envolve frequencia de uso, seguranca operacional, custo total e durabilidade no longo prazo.`,
    "",
    "## Criterios tecnicos que realmente importam",
    "- Potencia e estabilidade em uso continuo.",
    "- Ergonomia e conforto para longos periodos.",
    "- Facilidade de manutencao preventiva e custo de reposicao.",
    "- Rede de suporte, disponibilidade de pecas e confiabilidade da marca.",
    "",
    "## Para quem cada opcao faz sentido",
    `Para rotina intensa e baixa tolerancia a falhas, ${mainProduct} tende a entregar maior previsibilidade. Para uso ocasional e entrada com menor investimento, ${mainCompetitor} pode fazer sentido, desde que os limites tecnicos estejam claros.`,
    "",
    "## Recomendacao final",
    `Se o objetivo e reduzir risco de compra e manter performance estavel ao longo do tempo, priorize ${mainProduct}. Se o foco for custo inicial, valide contexto real de uso antes de decidir por ${mainCompetitor}.`,
    "",
    "## FAQ",
    faq.replace(/^-\s/gm, "- "),
    "",
    "## Conclusao",
    "Com uma comparacao orientada por contexto e criterio tecnico, a decisao fica mais segura, aumenta a satisfacao pos-compra e melhora a conversao afiliada com menor chance de arrependimento."
  ].join("\n");

  const recommendations = [
    "Na linha 3, apos a frase inicial da introducao, incluir experiencia real de uso para aumentar credibilidade.",
    "No bloco de comparacao, adicionar um exemplo pratico de decisao equivocada e impacto no custo total.",
    "Na recomendacao final, inserir perfil ideal de comprador (iniciante, recorrente, profissional).",
    "No FAQ, incluir uma pergunta sobre manutencao e vida util para reforcar decisao consciente."
  ].join("\n");

  return {
    primaryKeyword: terms[0] || "review comparativo",
    secondaryKeywords,
    seoTitle: `${title} | analise tecnica e decisao de compra`,
    metaDescription: `Analise tecnica de ${mainProduct} com comparativo direto, pontos criticos, recomendacoes praticas e decisao final para compra consciente.`,
    introduction: blogArticle,
    h2h3Blocks: [
      "H2: Cenario e dor principal do comprador",
      `H2: ${mainProduct} vs ${mainCompetitor} na pratica`,
      "H2: Criterios tecnicos que mudam a decisao",
      "H2: Para quem vale e para quem nao vale",
      "H2: Recomendacao final e CTA"
    ].join("\n"),
    technicalComparison: recommendation.join("\n"),
    usageGuide: recommendations,
    maintenanceGuide: "Mapear manutencao preventiva, custo de reposicao e sinais de desgaste antes da compra.",
    finalConclusion: `Se o foco for confianca e previsibilidade, priorize ${mainProduct}; se o foco for economia de entrada, compare com ${mainCompetitor} considerando ciclo de uso.`,
    faq
  };
}

export async function createContentMasterAction(formData: FormData) {
  const title = str(formData, "title");
  const category = str(formData, "category");
  const mainProduct = str(formData, "mainProduct");
  const mainCompetitor = str(formData, "mainCompetitor");
  const mainBrand = str(formData, "mainBrand");
  const competitorBrand = str(formData, "competitorBrand");
  const primaryKeyword = str(formData, "primaryKeyword");
  const secondaryKeywords = str(formData, "secondaryKeywords");
  const intent = str(formData, "intent");
  const funnelLevel = str(formData, "funnelLevel");
  const editorialSummary = str(formData, "editorialSummary");
  const valueProposition = str(formData, "valueProposition");
  const advantages = str(formData, "advantages");
  const disadvantages = str(formData, "disadvantages");
  const whereToUse = str(formData, "whereToUse");
  const whereNotToUse = str(formData, "whereNotToUse");
  const technicalAssessment = str(formData, "technicalAssessment");
  const commonFailureParts = str(formData, "commonFailureParts");
  const preventiveMaintenance = str(formData, "preventiveMaintenance");
  const durabilityCare = str(formData, "durabilityCare");
  const finalDecision = str(formData, "finalDecision");
  const mainCta = str(formData, "mainCta");
  const affiliateLinksJson = str(formData, "affiliateLinksJson") || "{}";
  const youtubeLinks = str(formData, "youtubeLinks");
  const blogLinks = str(formData, "blogLinks");
  const socialLinks = str(formData, "socialLinks");
  const status = str(formData, "status") || "draft";

  if (!title || !mainProduct || !mainCompetitor || !primaryKeyword) {
    throw new Error("Preencha título, produto principal, concorrente e palavra-chave.");
  }

  const created = await prisma.contentMaster.create({
    data: {
      title,
      category,
      mainProduct,
      mainCompetitor,
      mainBrand,
      competitorBrand,
      primaryKeyword,
      secondaryKeywords,
      intent,
      funnelLevel,
      editorialSummary,
      valueProposition,
      advantages,
      disadvantages,
      whereToUse,
      whereNotToUse,
      technicalAssessment,
      commonFailureParts,
      preventiveMaintenance,
      durabilityCare,
      finalDecision,
      mainCta,
      affiliateLinksJson,
      youtubeLinks: youtubeLinks || null,
      blogLinks: blogLinks || null,
      socialLinks: socialLinks || null,
      status
    }
  });

  await writeAuditLog({
    entityType: "ContentMaster",
    entityId: created.id,
    action: "create",
    summary: "Conteúdo principal criado",
    payload: { title, mainProduct, mainCompetitor, primaryKeyword }
  });

  revalidatePath("/conteudos-principais");
  redirect(`/conteudos-principais/${created.id}?ok=content-master-criado`);
}

export async function createContentFromInputAction(formData: FormData) {
  const rawText = str(formData, "rawText");
  const pdfName = str(formData, "pdfName") || str(formData, "pdfFile");
  const actionType = str(formData, "actionType") || "iniciar";
  const title = rawText.split("\n")[0].slice(0, 120) || `Projeto de conteúdo ${new Date().toLocaleDateString("pt-BR")}`;
  const equipmentMatches = rawText.match(/([A-Z][a-zA-Z]+\s+[A-Z0-9\-]{2,})/g) || [];
  const mainProduct = equipmentMatches[0] || "produto principal";
  const mainCompetitor = equipmentMatches[1] || "equipamento comparado";
  const mainCta = "Ver análise completa";
  const seoDraft = buildSeoAnalystDraft(rawText, title, mainProduct, mainCompetitor, pdfName);

  if (!rawText && !pdfName) {
    throw new Error("Informe texto ou nome do PDF para iniciar o projeto.");
  }

  const created = await prisma.contentMaster.create({
    data: {
      title,
      category: "conteudo-afiliado",
      mainProduct,
      mainCompetitor,
      mainBrand: "",
      competitorBrand: "",
      primaryKeyword: seoDraft.primaryKeyword,
      secondaryKeywords: seoDraft.secondaryKeywords,
      intent: "review/comparacao/conversao",
      funnelLevel: "fundo",
      editorialSummary: rawText ? rawText.slice(0, 2000) : `Origem PDF: ${pdfName}`,
      valueProposition: "Ajudar o comprador a decidir melhor antes de clicar no link afiliado.",
      advantages: "",
      disadvantages: "",
      whereToUse: "",
      whereNotToUse: "",
      technicalAssessment: "",
      commonFailureParts: "",
      preventiveMaintenance: "",
      durabilityCare: "",
      finalDecision: "",
      mainCta,
      affiliateLinksJson: "{}",
      youtubeLinks: null,
      blogLinks: null,
      socialLinks: null,
      status: "em_producao"
    }
  });

  await prisma.blogDraft.create({
    data: {
      contentMasterId: created.id,
      seoTitle: seoDraft.seoTitle,
      metaDescription: seoDraft.metaDescription,
      slug: title
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 120),
      h1: title,
      introduction: seoDraft.introduction,
      h2h3Blocks: seoDraft.h2h3Blocks,
      technicalComparison: seoDraft.technicalComparison,
      advantagesDisadvantages: "",
      usageGuide: seoDraft.usageGuide,
      maintenanceGuide: seoDraft.maintenanceGuide,
      wearParts: "",
      finalConclusion: seoDraft.finalConclusion,
      faq: seoDraft.faq,
      affiliateLinksBlock: "",
      youtubeBlock: "",
      socialLinksBlock: "",
      status: "em_producao"
    }
  });

  await writeAuditLog({
    entityType: "ContentMaster",
    entityId: created.id,
    action: "create",
    summary: "Projeto iniciado pela entrada de conteúdo",
    payload: { origem: rawText ? "texto_colado" : "pdf", title }
  });

  revalidatePath("/conteudos-principais");
  revalidatePath("/refino-seo");
  redirect(actionType === "enviar-refino" ? `/refino-seo?contentMasterId=${created.id}` : `/conteudos-principais/${created.id}?ok=content-master-criado`);
}

export async function updateContentMasterAction(formData: FormData) {
  const id = str(formData, "id");
  const title = str(formData, "title");
  const status = str(formData, "status");
  const before = await prisma.contentMaster.findUnique({ where: { id } });
  if (!id || !title) throw new Error("ID e título são obrigatórios.");

  const updated = await prisma.contentMaster.update({
    where: { id },
    data: {
      title,
      category: str(formData, "category"),
      mainProduct: str(formData, "mainProduct"),
      mainCompetitor: str(formData, "mainCompetitor"),
      mainBrand: str(formData, "mainBrand"),
      competitorBrand: str(formData, "competitorBrand"),
      primaryKeyword: str(formData, "primaryKeyword"),
      secondaryKeywords: str(formData, "secondaryKeywords"),
      intent: str(formData, "intent"),
      funnelLevel: str(formData, "funnelLevel"),
      editorialSummary: str(formData, "editorialSummary"),
      valueProposition: str(formData, "valueProposition"),
      advantages: str(formData, "advantages"),
      disadvantages: str(formData, "disadvantages"),
      whereToUse: str(formData, "whereToUse"),
      whereNotToUse: str(formData, "whereNotToUse"),
      technicalAssessment: str(formData, "technicalAssessment"),
      commonFailureParts: str(formData, "commonFailureParts"),
      preventiveMaintenance: str(formData, "preventiveMaintenance"),
      durabilityCare: str(formData, "durabilityCare"),
      finalDecision: str(formData, "finalDecision"),
      mainCta: str(formData, "mainCta"),
      affiliateLinksJson: str(formData, "affiliateLinksJson") || "{}",
      youtubeLinks: str(formData, "youtubeLinks") || null,
      blogLinks: str(formData, "blogLinks") || null,
      socialLinks: str(formData, "socialLinks") || null,
      status: status || "draft"
    }
  });

  await writeAuditLog({
    entityType: "ContentMaster",
    entityId: updated.id,
    action: "update",
    summary: "Conteúdo principal atualizado",
    before: before ? { title: before.title, status: before.status } : null,
    after: { title: updated.title, status: updated.status }
  });

  revalidatePath(`/conteudos-principais/${id}`);
  revalidatePath("/conteudos-principais");
  redirect(`/conteudos-principais/${id}?ok=content-master-atualizado`);
}

export async function createBlogDraftAction(formData: FormData) {
  const contentMasterId = str(formData, "contentMasterId");
  const seoTitle = str(formData, "seoTitle");
  const h1 = str(formData, "h1");
  if (!contentMasterId || !seoTitle || !h1) throw new Error("ContentMaster, SEO Title e H1 obrigatórios.");

  const created = await prisma.blogDraft.create({
    data: {
      contentMasterId,
      seoTitle,
      metaDescription: str(formData, "metaDescription"),
      slug: str(formData, "slug"),
      h1,
      introduction: str(formData, "introduction"),
      h2h3Blocks: str(formData, "h2h3Blocks"),
      technicalComparison: str(formData, "technicalComparison"),
      advantagesDisadvantages: str(formData, "advantagesDisadvantages"),
      usageGuide: str(formData, "usageGuide"),
      maintenanceGuide: str(formData, "maintenanceGuide"),
      wearParts: str(formData, "wearParts"),
      finalConclusion: str(formData, "finalConclusion"),
      faq: str(formData, "faq"),
      affiliateLinksBlock: str(formData, "affiliateLinksBlock"),
      youtubeBlock: str(formData, "youtubeBlock"),
      socialLinksBlock: str(formData, "socialLinksBlock"),
      status: str(formData, "status") || "draft"
    }
  });

  await writeAuditLog({ entityType: "BlogDraft", entityId: created.id, action: "create", summary: "Rascunho de blog criado" });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=blog-criado`);
}

export async function createChannelContentAction(formData: FormData) {
  const contentMasterId = str(formData, "contentMasterId");
  const channelType = str(formData, "channelType");
  const objective = str(formData, "objective");
  const format = str(formData, "format");
  if (!contentMasterId || !channelType || !format) throw new Error("ContentMaster, canal e formato são obrigatórios.");

  const created = await prisma.channelContent.create({
    data: {
      contentMasterId,
      channelType,
      objective,
      format,
      hook: str(formData, "hook"),
      copy: str(formData, "copy"),
      caption: str(formData, "caption"),
      cta: str(formData, "cta"),
      keywords: str(formData, "keywords"),
      hashtags: str(formData, "hashtags"),
      visualPrompt: str(formData, "visualPrompt"),
      copyPrompt: str(formData, "copyPrompt"),
      videoPrompt: str(formData, "videoPrompt"),
      artSpec: str(formData, "artSpec"),
      strategicNotes: str(formData, "strategicNotes"),
      productionStatus: str(formData, "productionStatus") || "draft",
      publicationStatus: str(formData, "publicationStatus") || "pending"
    }
  });

  await writeAuditLog({ entityType: "ChannelContent", entityId: created.id, action: "create", summary: "Conteúdo de canal criado" });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=canal-criado`);
}

export async function createCreativeAssetAction(formData: FormData) {
  const contentMasterId = str(formData, "contentMasterId");
  const title = str(formData, "title");
  if (!contentMasterId || !title) throw new Error("ContentMaster e título da arte são obrigatórios.");

  const created = await prisma.creativeAsset.create({
    data: {
      contentMasterId,
      channelContentId: str(formData, "channelContentId") || null,
      title,
      headline: str(formData, "headline"),
      subheadline: str(formData, "subheadline"),
      visualCta: str(formData, "visualCta"),
      artText: str(formData, "artText"),
      visualDirection: str(formData, "visualDirection"),
      visualStyle: str(formData, "visualStyle"),
      ratioFormat: str(formData, "ratioFormat"),
      coverReference: str(formData, "coverReference") || null,
      imagePrompt: str(formData, "imagePrompt"),
      variationPrompt: str(formData, "variationPrompt"),
      artStatus: str(formData, "artStatus") || "draft",
      finalApprovedVersion: str(formData, "finalApprovedVersion") || null
    }
  });

  await writeAuditLog({ entityType: "CreativeAsset", entityId: created.id, action: "create", summary: "Asset criativo criado" });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=asset-criado`);
}

export async function updateBlogDraftAction(formData: FormData) {
  const id = str(formData, "id");
  const contentMasterId = str(formData, "contentMasterId");
  if (!id || !contentMasterId) throw new Error("ID inválido para blog draft.");
  const before = await prisma.blogDraft.findUnique({ where: { id } });
  if (!before) throw new Error("Rascunho não encontrado para atualização.");

  const seoTitle = strOrNull(formData, "seoTitle");
  const metaDescription = strOrNull(formData, "metaDescription");
  const slug = strOrNull(formData, "slug");
  const h1 = strOrNull(formData, "h1");
  const introduction = strOrNull(formData, "introduction");
  const h2h3Blocks = strOrNull(formData, "h2h3Blocks");
  const technicalComparison = strOrNull(formData, "technicalComparison");
  const advantagesDisadvantages = strOrNull(formData, "advantagesDisadvantages");
  const usageGuide = strOrNull(formData, "usageGuide");
  const maintenanceGuide = strOrNull(formData, "maintenanceGuide");
  const wearParts = strOrNull(formData, "wearParts");
  const finalConclusion = strOrNull(formData, "finalConclusion");
  const faq = strOrNull(formData, "faq");
  const affiliateLinksBlock = strOrNull(formData, "affiliateLinksBlock");
  const youtubeBlock = strOrNull(formData, "youtubeBlock");
  const socialLinksBlock = strOrNull(formData, "socialLinksBlock");
  const status = strOrNull(formData, "status");

  const updated = await prisma.blogDraft.update({
    where: { id },
    data: {
      seoTitle: seoTitle ?? before.seoTitle,
      metaDescription: metaDescription ?? before.metaDescription,
      slug: slug ?? before.slug,
      h1: h1 ?? before.h1,
      introduction: introduction ?? before.introduction,
      h2h3Blocks: h2h3Blocks ?? before.h2h3Blocks,
      technicalComparison: technicalComparison ?? before.technicalComparison,
      advantagesDisadvantages: advantagesDisadvantages ?? before.advantagesDisadvantages,
      usageGuide: usageGuide ?? before.usageGuide,
      maintenanceGuide: maintenanceGuide ?? before.maintenanceGuide,
      wearParts: wearParts ?? before.wearParts,
      finalConclusion: finalConclusion ?? before.finalConclusion,
      faq: faq ?? before.faq,
      affiliateLinksBlock: affiliateLinksBlock ?? before.affiliateLinksBlock,
      youtubeBlock: youtubeBlock ?? before.youtubeBlock,
      socialLinksBlock: socialLinksBlock ?? before.socialLinksBlock,
      status: status || before.status || "draft"
    }
  });
  await writeAuditLog({
    entityType: "BlogDraft",
    entityId: updated.id,
    action: "update",
    summary: "Blog draft atualizado",
    before: before ? { seoTitle: before.seoTitle, status: before.status } : null,
    after: { seoTitle: updated.seoTitle, status: updated.status }
  });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  revalidatePath("/produtos-afiliados");
  redirect(`/produtos-afiliados?contentMasterId=${contentMasterId}&ok=refino-confirmado`);
}

export async function updateChannelContentAction(formData: FormData) {
  const id = str(formData, "id");
  const contentMasterId = str(formData, "contentMasterId");
  if (!id || !contentMasterId) throw new Error("ID inválido para channel content.");
  const before = await prisma.channelContent.findUnique({ where: { id } });
  const updated = await prisma.channelContent.update({
    where: { id },
    data: {
      channelType: str(formData, "channelType"),
      objective: str(formData, "objective"),
      format: str(formData, "format"),
      hook: str(formData, "hook"),
      copy: str(formData, "copy"),
      caption: str(formData, "caption"),
      cta: str(formData, "cta"),
      keywords: str(formData, "keywords"),
      hashtags: str(formData, "hashtags"),
      visualPrompt: str(formData, "visualPrompt"),
      copyPrompt: str(formData, "copyPrompt"),
      videoPrompt: str(formData, "videoPrompt"),
      artSpec: str(formData, "artSpec"),
      strategicNotes: str(formData, "strategicNotes"),
      productionStatus: str(formData, "productionStatus") || "draft",
      publicationStatus: str(formData, "publicationStatus") || "pending"
    }
  });
  await writeAuditLog({
    entityType: "ChannelContent",
    entityId: updated.id,
    action: "update",
    summary: "Conteúdo de canal atualizado",
    before: before ? { channelType: before.channelType, productionStatus: before.productionStatus } : null,
    after: { channelType: updated.channelType, productionStatus: updated.productionStatus }
  });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=canal-atualizado`);
}

export async function updateCreativeAssetAction(formData: FormData) {
  const id = str(formData, "id");
  const contentMasterId = str(formData, "contentMasterId");
  if (!id || !contentMasterId) throw new Error("ID inválido para creative asset.");
  const before = await prisma.creativeAsset.findUnique({ where: { id } });
  const updated = await prisma.creativeAsset.update({
    where: { id },
    data: {
      title: str(formData, "title"),
      headline: str(formData, "headline"),
      subheadline: str(formData, "subheadline"),
      visualCta: str(formData, "visualCta"),
      artText: str(formData, "artText"),
      visualDirection: str(formData, "visualDirection"),
      visualStyle: str(formData, "visualStyle"),
      ratioFormat: str(formData, "ratioFormat"),
      coverReference: str(formData, "coverReference") || null,
      imagePrompt: str(formData, "imagePrompt"),
      variationPrompt: str(formData, "variationPrompt"),
      artStatus: str(formData, "artStatus") || "draft",
      finalApprovedVersion: str(formData, "finalApprovedVersion") || null
    }
  });
  await writeAuditLog({
    entityType: "CreativeAsset",
    entityId: updated.id,
    action: "update",
    summary: "Asset criativo atualizado",
    before: before ? { title: before.title, artStatus: before.artStatus } : null,
    after: { title: updated.title, artStatus: updated.artStatus }
  });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=asset-atualizado`);
}

export async function generateBlogAiAction(formData: FormData) {
  const contentMasterId = str(formData, "contentMasterId");
  if (!contentMasterId) throw new Error("Conteúdo principal obrigatório.");
  const master = await prisma.contentMaster.findUnique({ where: { id: contentMasterId } });
  if (!master) throw new Error("Conteúdo principal não encontrado.");
  const template = await prisma.promptTemplate.findFirst({ where: { active: true, objective: { contains: "copy" } } });

  const seoTitle = `${master.mainProduct} ou ${master.mainCompetitor}: comparativo técnico e decisão certa`;
  const bodyPrefix = template?.body ? `${template.body}\n\n` : "";

  const created = await prisma.blogDraft.create({
    data: {
      contentMasterId,
      seoTitle,
      metaDescription: `Guia completo para decidir entre ${master.mainProduct} e ${master.mainCompetitor}.`,
      slug: `${master.mainProduct}-${master.mainCompetitor}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      h1: `${master.mainProduct} vs ${master.mainCompetitor}`,
      introduction: `${bodyPrefix}Neste guia, comparamos desempenho, manutenção e custo-benefício para você escolher sem erro.`,
      h2h3Blocks: "Comparação técnica\nVantagens e desvantagens\nOnde usar\nManutenção e durabilidade",
      technicalComparison: `Potência, ergonomia e desempenho prático entre ${master.mainProduct} e ${master.mainCompetitor}.`,
      advantagesDisadvantages: `${master.advantages}\n\n${master.disadvantages}`,
      usageGuide: master.whereToUse,
      maintenanceGuide: master.preventiveMaintenance,
      wearParts: master.commonFailureParts,
      finalConclusion: master.finalDecision,
      faq: "Qual tem melhor custo-benefício?\nQual dura mais?",
      affiliateLinksBlock: master.affiliateLinksJson,
      youtubeBlock: master.youtubeLinks || "",
      socialLinksBlock: master.socialLinks || "",
      status: "em_producao"
    }
  });

  await writeAuditLog({ entityType: "BlogDraft", entityId: created.id, action: "create", summary: "Blog gerado por IA assistida" });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=blog-gerado`);
}

export async function generateChannelAiAction(formData: FormData) {
  const contentMasterId = str(formData, "contentMasterId");
  const channelType = str(formData, "channelType") || "Instagram Reel";
  if (!contentMasterId) throw new Error("Conteúdo principal obrigatório.");
  const master = await prisma.contentMaster.findUnique({ where: { id: contentMasterId } });
  if (!master) throw new Error("Conteúdo principal não encontrado.");

  const hook = `Qual escolher: ${master.mainProduct} ou ${master.mainCompetitor}?`;
  const cta = master.mainCta || "Veja os links afiliados e escolha com segurança";

  const created = await prisma.channelContent.create({
    data: {
      contentMasterId,
      channelType,
      objective: "engajar e converter",
      format: channelType.includes("Reel") || channelType.includes("TikTok") || channelType.includes("Kwai") ? "vídeo curto" : "post",
      hook,
      copy: `Comparativo direto: ${master.mainProduct} vs ${master.mainCompetitor}. ${master.valueProposition}`,
      caption: `${master.mainProduct} ou ${master.mainCompetitor}? Veja o comparativo e decida certo.`,
      cta,
      keywords: `${master.primaryKeyword},${master.secondaryKeywords}`,
      hashtags: "#ferramentas #comparativo #decisaocerta",
      visualPrompt: `Cena comparativa entre ${master.mainProduct} e ${master.mainCompetitor}, estilo técnico e limpo`,
      copyPrompt: "Texto curto, direto, orientado a benefício e decisão",
      videoPrompt: "Roteiro de 30-45s com hook forte e CTA final",
      artSpec: "headline forte + 3 bullets + CTA",
      strategicNotes: `Estratégia específica para ${channelType}`,
      productionStatus: "em_producao",
      publicationStatus: "pending"
    }
  });

  await writeAuditLog({ entityType: "ChannelContent", entityId: created.id, action: "create", summary: "Conteúdo por canal gerado por IA assistida" });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=canal-gerado`);
}

export async function generateCreativeAiAction(formData: FormData) {
  const contentMasterId = str(formData, "contentMasterId");
  const channelContentId = str(formData, "channelContentId");
  if (!contentMasterId) throw new Error("Conteúdo principal obrigatório.");

  const master = await prisma.contentMaster.findUnique({ where: { id: contentMasterId } });
  if (!master) throw new Error("Conteúdo principal não encontrado.");
  const channelContent = channelContentId ? await prisma.channelContent.findUnique({ where: { id: channelContentId } }) : null;

  const created = await prisma.creativeAsset.create({
    data: {
      contentMasterId,
      channelContentId: channelContentId || null,
      title: `Arte IA - ${master.mainProduct} vs ${master.mainCompetitor}`,
      headline: `${master.mainProduct} ou ${master.mainCompetitor}?`,
      subheadline: "Comparativo técnico rápido",
      visualCta: "Veja a decisão certa",
      artText: "Performance, manutenção e custo-benefício em 1 análise",
      visualDirection: "produto x concorrente lado a lado",
      visualStyle: "premium clean",
      ratioFormat: channelContent?.format.includes("vídeo") ? "1080x1920" : "1080x1080",
      coverReference: null,
      imagePrompt: `Imagem comparativa realista de ${master.mainProduct} e ${master.mainCompetitor}, estilo comercial premium`,
      variationPrompt: "versão com fundo escuro e destaques em amarelo",
      artStatus: "em_producao",
      finalApprovedVersion: null
    }
  });

  await writeAuditLog({ entityType: "CreativeAsset", entityId: created.id, action: "create", summary: "Asset gerado por IA assistida" });
  revalidatePath(`/conteudos-principais/${contentMasterId}`);
  redirect(`/conteudos-principais/${contentMasterId}?ok=asset-gerado`);
}
