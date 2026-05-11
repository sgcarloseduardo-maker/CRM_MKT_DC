import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function main() {
  await prisma.session.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.user.deleteMany();
  await prisma.metricSnapshot.deleteMany();
  await prisma.creativeAsset.deleteMany();
  await prisma.channelContent.deleteMany();
  await prisma.blogDraft.deleteMany();
  await prisma.contentMaster.deleteMany();
  await prisma.publicationLog.deleteMany();
  await prisma.publicationPlan.deleteMany();
  await prisma.complianceChecklist.deleteMany();
  await prisma.contentBrief.deleteMany();
  await prisma.campaign.deleteMany();

  const adminPasswordHash = await hash("admin123", 10);
  const editorPasswordHash = await hash("editor123", 10);

  const adminUser = await prisma.user.create({
    data: {
      username: "admin",
      passwordHash: adminPasswordHash,
      role: "admin",
      isActive: true
    }
  });

  const editorUser = await prisma.user.create({
    data: {
      username: "editor",
      passwordHash: editorPasswordHash,
      role: "editor",
      isActive: true
    }
  });

  const instagram = await prisma.channel.upsert({
    where: { slug: "instagram" },
    update: {
      name: "Instagram",
      strategy: "Conteúdo curto com foco em dor, solução e CTA afiliado"
    },
    create: {
      slug: "instagram",
      name: "Instagram",
      strategy: "Conteúdo curto com foco em dor, solução e CTA afiliado"
    }
  });

  const productSeeds = [
    ["Parafusadeira/Furadeira 20V", "ferramentas-eletricas", "DeWalt", "https://exemplo.afiliado/dewalt-parafusadeira", "R$ 450-800", true],
    ["Martelete Rompedor SDS Plus", "demolicao", "Bosch", "https://exemplo.afiliado/bosch-martelete", "R$ 700-1400", true],
    ["Serra Mármore 1250W", "corte", "Makita", "https://exemplo.afiliado/makita-serra-marmore", "R$ 300-550", false],
    ["Furadeira de Impacto 710W", "furadeiras", "Bosch", "https://exemplo.afiliado/furadeira-impacto", "R$ 250-420", false]
  ] as const;

  const products = [] as { id: string }[];
  for (const [name, category, brand, affiliateUrl, priceRange, isPriority] of productSeeds) {
    const slug = slugify(`${name}-${brand}`);
    const product = await prisma.affiliateProduct.upsert({
      where: { slug },
      update: { name, category, brand, affiliateUrl, priceRange, isPriority },
      create: { slug, name, category, brand, affiliateUrl, priceRange, isPriority }
    });
    products.push(product);
  }

  const prompt1 = await prisma.promptTemplate.upsert({
    where: { name_channelId: { name: "Instagram Brief para Copy", channelId: instagram.id } },
    update: {
      objective: "copy",
      format: "feed",
      body: "Gere copy baseada em dor, benefício, prova e CTA com disclosure de afiliado.",
      active: true
    },
    create: {
      name: "Instagram Brief para Copy",
      objective: "copy",
      format: "feed",
      body: "Gere copy baseada em dor, benefício, prova e CTA com disclosure de afiliado.",
      version: "v1",
      active: true,
      channelId: instagram.id
    }
  });

  const prompt2 = await prisma.promptTemplate.upsert({
    where: { name_channelId: { name: "Instagram Checklist de Publicação", channelId: instagram.id } },
    update: {
      objective: "checklist",
      format: "reels",
      body: "Valide gancho, clareza da oferta, CTA, linguagem e compliance de afiliado.",
      active: true
    },
    create: {
      name: "Instagram Checklist de Publicação",
      objective: "checklist",
      format: "reels",
      body: "Valide gancho, clareza da oferta, CTA, linguagem e compliance de afiliado.",
      version: "v1",
      active: true,
      channelId: instagram.id
    }
  });

  const campaign = await prisma.campaign.create({
    data: {
      name: "Campanha Instagram Ferramentas 1",
      objective: "Conversão afiliada",
      status: "planning",
      channelId: instagram.id,
      affiliateProductId: products[0].id
    }
  });

  const contentMaster = await prisma.contentMaster.create({
    data: {
      title: "Makita HR2470 vs Bosch GBH 2-24D: qual escolher?",
      category: "Comparativo de Ferramentas",
      mainProduct: "Makita HR2470",
      mainCompetitor: "Bosch GBH 2-24D",
      mainBrand: "Makita",
      competitorBrand: "Bosch",
      primaryKeyword: "makita hr2470 ou bosch gbh 2-24d",
      secondaryKeywords: "martelete makita, martelete bosch, comparativo martelete",
      intent: "comparação para decisão de compra",
      funnelLevel: "middle",
      editorialSummary: "Comparativo técnico para decidir entre dois modelos populares.",
      valueProposition: "Evitar compra errada com comparação prática e técnica.",
      advantages: "robustez, ergonomia, assistência",
      disadvantages: "preço, vibração, acessórios",
      whereToUse: "obras residenciais e profissionais",
      whereNotToUse: "uso extremo contínuo sem pausa",
      technicalAssessment: "ambos competentes, escolha depende de perfil de uso",
      commonFailureParts: "escovas, cabo, mandril",
      preventiveMaintenance: "limpeza e inspeção periódica",
      durabilityCare: "armazenamento seco e uso de acessórios corretos",
      finalDecision: "escolha pelo tipo de uso e disponibilidade de assistência",
      mainCta: "Veja o comparativo completo e escolha com segurança",
      affiliateLinksJson: JSON.stringify({ amazon: "https://exemplo.afiliado/hr2470", mercadolivre: "https://exemplo.afiliado/gbh224d" }),
      youtubeLinks: "https://youtube.com/watch?v=demo",
      blogLinks: "https://blog.exemplo.com/makita-vs-bosch",
      socialLinks: "https://instagram.com/exemplo",
      status: "in_production"
    }
  });

  await prisma.blogDraft.create({
    data: {
      contentMasterId: contentMaster.id,
      seoTitle: "Makita HR2470 ou Bosch GBH 2-24D: comparativo completo",
      metaDescription: "Comparação técnica completa entre Makita HR2470 e Bosch GBH 2-24D.",
      slug: "makita-hr2470-vs-bosch-gbh-2-24d",
      h1: "Makita HR2470 vs Bosch GBH 2-24D",
      introduction: "Se você está em dúvida entre esses modelos, este guia é para você.",
      h2h3Blocks: "Especificações, desempenho, custo-benefício",
      technicalComparison: "potência, impacto, ergonomia",
      advantagesDisadvantages: "prós e contras objetivos",
      usageGuide: "quando escolher cada modelo",
      maintenanceGuide: "rotina mínima recomendada",
      wearParts: "peças com maior desgaste",
      finalConclusion: "decisão por perfil de uso",
      faq: "perguntas frequentes",
      affiliateLinksBlock: "links de compra",
      youtubeBlock: "vídeo review",
      socialLinksBlock: "redes de apoio",
      status: "draft"
    }
  });

  const instagramContent = await prisma.channelContent.create({
    data: {
      contentMasterId: contentMaster.id,
      channelType: "Instagram Reel",
      objective: "retenção + clique",
      format: "Reel 9:16",
      hook: "Qual martelete vale mais a pena?",
      copy: "Comparativo rápido com decisão prática.",
      caption: "Makita vs Bosch em 30 segundos.",
      cta: "Veja os links no perfil",
      keywords: "makita hr2470,bosch gbh 2-24d,comparativo",
      hashtags: "#ferramentas #makita #bosch",
      visualPrompt: "cena dividida com as duas ferramentas",
      copyPrompt: "texto curto, direto e técnico",
      videoPrompt: "cortes rápidos com prova visual",
      artSpec: "legenda curta + CTA final",
      strategicNotes: "foco em retenção e tráfego",
      productionStatus: "in_production",
      publicationStatus: "pending"
    }
  });

  await prisma.creativeAsset.create({
    data: {
      contentMasterId: contentMaster.id,
      channelContentId: instagramContent.id,
      title: "Comparativo Makita x Bosch",
      headline: "Makita ou Bosch?",
      subheadline: "Decida em 1 minuto",
      visualCta: "Confira o comparativo",
      artText: "Teste técnico e decisão certa",
      visualDirection: "split screen",
      visualStyle: "industrial clean",
      ratioFormat: "1080x1920",
      coverReference: "capa_reel_01",
      imagePrompt: "duas ferramentas lado a lado",
      variationPrompt: "versão com fundo escuro",
      artStatus: "review",
      finalApprovedVersion: null
    }
  });

  await prisma.campaign.update({
    where: { id: campaign.id },
    data: { contentMasterId: contentMaster.id }
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      name: "Campanha Instagram Serra Mármore",
      objective: "Cliques para review",
      status: "active",
      channelId: instagram.id,
      affiliateProductId: products[2].id
    }
  });

  const brief1 = await prisma.contentBrief.create({
    data: {
      title: "Brief Reel Parafusadeira",
      objective: "Gerar clique afiliado",
      targetPersona: "DIY e pequenos reparos",
      status: "draft",
      payloadJson: JSON.stringify({ angle: "resolver em casa sem comprar ferramenta" }),
      channelId: instagram.id,
      campaignId: campaign.id,
      promptTemplateId: prompt1.id
    }
  });

  await prisma.contentBrief.create({
    data: {
      title: "Brief Carrossel Comparativo",
      objective: "Educar e converter",
      targetPersona: "Profissionais autônomos",
      status: "draft",
      payloadJson: JSON.stringify({ angle: "comparativo de torque e autonomia" }),
      channelId: instagram.id,
      campaignId: campaign.id,
      promptTemplateId: prompt2.id
    }
  });

  const checklist = await prisma.complianceChecklist.create({
    data: {
      title: "Checklist Compliance Instagram",
      rulesJson: JSON.stringify([
        "Adicionar disclosure de afiliado",
        "Evitar promessa absoluta",
        "CTA com transparência"
      ]),
      isApproved: false,
      channelId: instagram.id,
      campaignId: campaign.id,
      contentBriefId: brief1.id
    }
  });

  const plan = await prisma.publicationPlan.create({
    data: {
      title: "Publicar Reel Parafusadeira",
      scheduledFor: new Date(Date.now() + 86400000),
      format: "reels",
      status: "planned",
      channelId: instagram.id,
      campaignId: campaign.id,
      contentBriefId: brief1.id,
      checklistId: checklist.id
    }
  });

  await prisma.publicationLog.create({
    data: {
      status: "published",
      outcome: "Publicado com sucesso",
      url: "https://instagram.com/p/exemplo123",
      postedAt: new Date(),
      notes: "Primeira publicação do fluxo MVP",
      publicationPlanId: plan.id,
      channelId: instagram.id
    }
  });

  await prisma.metricSnapshot.createMany({
    data: [
      {
        metricType: "views",
        metricValue: 1820,
        snapshotAt: new Date(),
        channelId: instagram.id,
        campaignId: campaign.id,
        publicationPlanId: plan.id
      },
      {
        metricType: "clicks",
        metricValue: 94,
        snapshotAt: new Date(),
        channelId: instagram.id,
        campaignId: campaign.id,
        publicationPlanId: plan.id
      },
      {
        metricType: "ctr",
        metricValue: 5.16,
        snapshotAt: new Date(),
        channelId: instagram.id,
        campaignId: campaign.id,
        publicationPlanId: plan.id
      }
    ]
  });

  const brief3 = await prisma.contentBrief.create({
    data: {
      title: "Brief Reel Serra Mármore",
      objective: "Gerar tráfego para review",
      targetPersona: "Profissionais de acabamento",
      status: "draft",
      payloadJson: JSON.stringify({ angle: "corte limpo e velocidade" }),
      channelId: instagram.id,
      campaignId: campaign2.id,
      promptTemplateId: prompt1.id
    }
  });

  const checklist2 = await prisma.complianceChecklist.create({
    data: {
      title: "Checklist Campanha Serra",
      rulesJson: JSON.stringify(["Sem claims absolutos", "Disclosure visível"]),
      isApproved: true,
      channelId: instagram.id,
      campaignId: campaign2.id,
      contentBriefId: brief3.id
    }
  });

  const plan2 = await prisma.publicationPlan.create({
    data: {
      title: "Publicar Carrossel Serra Mármore",
      scheduledFor: new Date(Date.now() + 172800000),
      format: "feed",
      status: "pending",
      channelId: instagram.id,
      campaignId: campaign2.id,
      contentBriefId: brief3.id,
      checklistId: checklist2.id
    }
  });

  await prisma.publicationLog.createMany({
    data: [
      {
        status: "pending",
        outcome: "Aguardando aprovação final",
        notes: "Dependente de ajuste de thumbnail",
        publicationPlanId: plan2.id,
        channelId: instagram.id
      },
      {
        status: "error",
        outcome: "Erro na publicação",
        notes: "Falha temporária da plataforma",
        publicationPlanId: plan2.id,
        channelId: instagram.id
      }
    ]
  });

  await prisma.metricSnapshot.createMany({
    data: [
      {
        metricType: "views",
        metricValue: 940,
        snapshotAt: new Date(),
        channelId: instagram.id,
        campaignId: campaign2.id,
        publicationPlanId: plan2.id
      },
      {
        metricType: "shares",
        metricValue: 27,
        snapshotAt: new Date(),
        channelId: instagram.id,
        campaignId: campaign2.id,
        publicationPlanId: plan2.id
      }
    ]
  });

  for (let i = 1; i <= 12; i++) {
    const planLoop = await prisma.publicationPlan.create({
      data: {
        title: `Publicação Rotina ${i}`,
        scheduledFor: new Date(Date.now() - i * 86400000),
        format: i % 2 === 0 ? "reels" : "feed",
        status: i % 4 === 0 ? "published" : i % 3 === 0 ? "error" : "pending",
        channelId: instagram.id,
        campaignId: i % 2 === 0 ? campaign.id : campaign2.id,
        contentBriefId: i % 2 === 0 ? brief1.id : brief3.id,
        checklistId: i % 2 === 0 ? checklist.id : checklist2.id
      }
    });

    await prisma.publicationLog.create({
      data: {
        status: i % 4 === 0 ? "published" : i % 3 === 0 ? "error" : "pending",
        outcome: i % 4 === 0 ? "Execução normal" : "Aguardando ajustes",
        url: i % 4 === 0 ? `https://instagram.com/p/demo${i}` : null,
        postedAt: i % 4 === 0 ? new Date(Date.now() - i * 86000000) : null,
        notes: `Rotina operacional ${i}`,
        publicationPlanId: planLoop.id,
        channelId: instagram.id
      }
    });

    await prisma.metricSnapshot.createMany({
      data: [
        {
          metricType: "views",
          metricValue: 500 + i * 120,
          snapshotAt: new Date(Date.now() - i * 86000000),
          channelId: instagram.id,
          campaignId: i % 2 === 0 ? campaign.id : campaign2.id,
          publicationPlanId: planLoop.id
        },
        {
          metricType: "clicks",
          metricValue: 20 + i * 4,
          snapshotAt: new Date(Date.now() - i * 85000000),
          channelId: instagram.id,
          campaignId: i % 2 === 0 ? campaign.id : campaign2.id,
          publicationPlanId: planLoop.id
        },
        {
          metricType: "ctr",
          metricValue: 2.5 + i * 0.2,
          snapshotAt: new Date(Date.now() - i * 84000000),
          channelId: instagram.id,
          campaignId: i % 2 === 0 ? campaign.id : campaign2.id,
          publicationPlanId: planLoop.id
        }
      ]
    });
  }

  await prisma.auditLog.createMany({
    data: [
      { entityType: "ContentBrief", entityId: brief1.id, action: "create", actor: "admin", actorUserId: adminUser.id, summary: "Seed brief 1" },
      { entityType: "PublicationPlan", entityId: plan.id, action: "create", actor: "admin", actorUserId: adminUser.id, summary: "Seed plan 1" },
      { entityType: "PublicationLog", entityId: plan2.id, action: "create", actor: "editor", actorUserId: editorUser.id, summary: "Seed log set" }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
