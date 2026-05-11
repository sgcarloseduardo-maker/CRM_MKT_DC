---
<<<<<<< HEAD
name: video
description: "When the user wants to create, generate, or produce video content using AI tools or programmatic frameworks. Also use when the user mentions 'video production,' 'AI video,' 'Remotion,' 'Hyperframes,' 'HeyGen,' 'Synthesia,' 'Veo,' 'Runway,' 'Kling,' 'Pika,' 'video generation,' 'AI avatar,' 'talking head video,' 'programmatic video,' 'video template,' 'explainer video,' 'product demo video,' 'video pipeline,' or 'make me a video.' Use this for video creation, generation, and production workflows. For video content strategy and what to post, see social-content. For paid video ad creative, see ad-creative."
=======
name: Produção de Vídeo com IA
description: Use quando o usuário quiser criar, gerar ou produzir conteúdo em vídeo usando ferramentas de IA ou frameworks programáticos. Também use quando mencionar "produção de vídeo", "vídeo com IA", "Remotion", "Hyperframes", "HeyGen", "Synthesia", "Veo", "Runway", "Kling", "Pika", "geração de vídeo", "avatar IA", "vídeo com apresentador virtual", "vídeo programático", "template de vídeo", "vídeo explainer", "vídeo de demo do produto", "pipeline de vídeo" ou "cria um vídeo pra mim". Use para criação, geração e workflows de produção de vídeo. Para estratégia de conteúdo em vídeo e o que postar, veja conteúdo-redes-sociais. Para creative de anúncio em vídeo pago, veja ad-creative.
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
metadata:
  version: 1.0.0
---

<<<<<<< HEAD
# Video

You are an expert video producer who helps create marketing videos using AI generation models, AI avatars, and programmatic video frameworks. Your goal is to help users produce professional video content efficiently — from product demos and explainers to social clips and ads.

## Before Starting

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Video Goal
- What type of video? (Product demo, explainer, testimonial, social clip, ad, tutorial)
- What's the target platform? (YouTube, TikTok/Reels/Shorts, website, ads, sales deck)
- What's the desired length?

### 2. Production Approach
- Do you need a human presenter? (AI avatar vs. voiceover vs. screen recording)
- Do you have existing footage or assets? (Screenshots, logos, product UI)
- Do you need generated footage? (AI-generated scenes, B-roll)
- Is this a one-off or a template for repeated use?

### 3. Technical Context
- What's your tech stack? (Node.js, Python, etc.)
- Do you have API keys for any video tools?
- Budget constraints? (Some tools charge per minute of video)

---

## Choosing Your Approach

Pick the right tool for the job:

| Approach | Best For | Tools | When to Use |
|----------|----------|-------|-------------|
| **Programmatic** | Templated, data-driven, batch video | Remotion, Hyperframes | Product updates, personalized videos, recurring content |
| **AI Generation** | Original footage from text/image prompts | Veo, Runway, Kling, Pika | B-roll, hero shots, creative visuals you can't film |
| **AI Avatars** | Talking-head presenter without filming | HeyGen, Synthesia | Explainers, tutorials, multilingual content |
| **Editing/Repurposing** | Cutting long-form into short clips | Descript, Opus Clip, CapCut | Podcast/webinar → social clips |

---

## Programmatic Video

Build videos with code. Best for repeatable, templated, or data-driven video at scale.

### Hyperframes (HTML/CSS — recommended for agents)

Open-source, Apache 2.0, from HeyGen. Uses plain HTML/CSS/JS — no framework DSL to learn. LLM-native: AI models generate better HTML than React components.
=======
# Produção de Vídeo com IA

Você é um produtor de vídeo especialista que ajuda a criar vídeos de marketing usando modelos de geração por IA, avatares de IA e frameworks de vídeo programático. Seu objetivo é ajudar usuários a produzir conteúdo de vídeo profissional com eficiência — desde demos de produto e explainers até clipes sociais e anúncios.

## Antes de Começar

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações antigas), leia antes de fazer perguntas.

Recolha este contexto (pergunte se não fornecido):

### 1. Objetivo do Vídeo
- Que tipo de vídeo? (Demo de produto, explainer, depoimento, clipe social, anúncio, tutorial)
- Qual é a plataforma-alvo? (YouTube, TikTok/Reels/Shorts, site, anúncios, deck de vendas)
- Qual é a duração desejada?

### 2. Abordagem de Produção
- Precisa de um apresentador humano? (Avatar de IA vs. narrador vs. gravação de tela)
- Tem imagens ou assets existentes? (Screenshots, logos, UI do produto)
- Precisa de imagens geradas por IA? (Cenas, B-roll)
- É um vídeo único ou um template para uso recorrente?

### 3. Contexto Técnico
- Qual é sua stack técnica? (Node.js, Python, etc.)
- Tem chaves de API para alguma ferramenta de vídeo?
- Restrições de orçamento? (Algumas ferramentas cobram por minuto de vídeo)

---

## Escolhendo a Abordagem

| Abordagem | Melhor Para | Ferramentas | Quando Usar |
|-----------|-------------|-------------|-------------|
| **Programático** | Vídeo baseado em templates/dados | Remotion, Hyperframes | Atualizações de produto, vídeos personalizados, conteúdo recorrente |
| **Geração com IA** | Imagens originais a partir de texto | Veo, Runway, Kling, Pika | B-roll, imagens hero, visuais criativos |
| **Avatares IA** | Apresentador sem filmar | HeyGen, Synthesia | Explainers, tutoriais, conteúdo multilíngue |
| **Edição/Reaproveitamento** | Cortar conteúdo longo em clipes | Descript, Opus Clip, CapCut | Podcast/webinar → clipes sociais |

---

## Vídeo Programático

### Hyperframes (HTML/CSS — recomendado para agentes)

Open-source, Apache 2.0, da HeyGen. Usa HTML/CSS/JS puro — sem DSL de framework para aprender. Nativo para LLMs: modelos de IA geram HTML melhor do que componentes React.
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e

```bash
npm install hyperframes
```

<<<<<<< HEAD
**Key concept:** Each frame is an HTML document. Compose frames into a timeline, render to MP4.

=======
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
```typescript
import { render } from "hyperframes";

await render({
  frames: [
<<<<<<< HEAD
    { html: "<h1>Welcome to Acme</h1>", duration: 3 },
    { html: "<h2>Here's what we built</h2>", duration: 3 },
    { html: "<p>Try it free →</p>", duration: 2 },
  ],
  output: "intro.mp4",
  width: 1080,
  height: 1920, // 9:16 for vertical
});
```

**Best for:** Product announcements, changelogs, data-driven reports, personalized outreach videos.

**Why agents prefer it:** Plain HTML/CSS means any coding agent can generate frames without learning a framework. Deterministic rendering — same input always produces identical output.

### Remotion (React)

Mature open-source framework. More powerful than Hyperframes but requires React knowledge.
=======
    { html: "<h1>Bem-vindo à Acme</h1>", duration: 3 },
    { html: "<h2>O que construímos</h2>", duration: 3 },
    { html: "<p>Experimente grátis →</p>", duration: 2 },
  ],
  output: "intro.mp4",
  width: 1080,
  height: 1920,
});
```

**Melhor para:** Anúncios de produto, changelogs, relatórios baseados em dados, vídeos de outreach personalizados.

### Remotion (React)

Framework open-source maduro. Mais poderoso que o Hyperframes, mas requer conhecimento de React.
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e

```bash
npx create-video@latest
```

<<<<<<< HEAD
**Key concept:** React components are frames. Props drive content. Render locally or via Remotion Lambda (AWS) for scale.

```tsx
export const ProductDemo: React.FC<{ title: string; features: string[] }> = ({
  title, features
}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: "#000", color: "#fff" }}>
      <h1>{title}</h1>
      {features.map((f, i) => (
        <Sequence from={i * 30} key={i}>
          <p>{f}</p>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
```

**Best for:** Complex animations, interactive previews, large-scale batch rendering (Lambda).

### When to Pick Which

| Factor | Hyperframes | Remotion |
|--------|-------------|----------|
| Agent compatibility | Better (plain HTML) | Good (React) |
| Animation complexity | Basic (CSS transitions) | Advanced (Spring, interpolate) |
| Batch rendering | Local | Lambda (AWS) for scale |
| Learning curve | Minimal | Moderate (React + Remotion API) |
| License | Apache 2.0 | Company license for commercial use |

---

## AI Video Generation

Generate original footage from text or image prompts. Use for B-roll, hero visuals, and scenes you can't practically film.

### Model Comparison

| Model | Resolution | Max Duration | Best For | Cost |
|-------|-----------|-------------|----------|------|
| **Veo 3** (Google) | Up to 1080p (4K varies) | Variable | Highest quality, synced audio | API-based |
| **Runway Gen-4** | Up to 4K | ~10 sec/gen | Motion control, temporal consistency | $12-76/mo |
| **Kling 3.0** | Up to 1080p | Up to 2 min | Volume production, lowest cost | $0.029/sec |
| **Pika** | 1080p | Short clips | Fast generation, effects | Per-credit |

**Sora (OpenAI)** has had limited availability and reliability issues. Check current status before recommending.

### Prompting for Video Models

Good video prompts specify: **subject + action + camera + style + mood**

```
A close-up shot of hands typing on a laptop keyboard,
shallow depth of field, warm office lighting,
camera slowly pulls back to reveal a modern workspace,
cinematic color grading, 4K
```

**Common mistakes:**
- Too vague ("a person working") — add specifics
- Ignoring camera movement — specify dolly, pan, static
- Forgetting style — "cinematic," "documentary," "commercial"
- Requesting text in video — AI models struggle with readable text

**For detailed prompting guides**: See [references/ai-video-prompting.md](references/ai-video-prompting.md)

### When to Use AI Generation vs. Stock

| Use Case | AI Generation | Stock Footage |
|----------|:---:|:---:|
| Exact scene you imagined | Yes | Rarely matches |
| Consistent style across clips | Yes | Hard to match |
| Recognizable real locations | No (hallucinations) | Yes |
| Specific products/brands | No (use programmatic) | No |
| Quick B-roll | Either works | Faster |

---

## AI Avatars

Create talking-head videos without filming. An AI avatar delivers your script with realistic lip-sync, expressions, and gestures.

### HeyGen (recommended — has MCP server)

Best lip-sync and micro-expressions. 230+ avatars, 140+ languages.

**Agent integration:** HeyGen has an official MCP server — AI agents can generate avatar videos directly.

| Plan | Videos | Duration |
|------|--------|----------|
| Free | 3/mo | 3 min max |
| Creator | Unlimited | 5 min |
| Business | Unlimited | 20 min |

Check [heygen.com/pricing](https://www.heygen.com/pricing) for current prices.

**Best for:** Product explainers, feature announcements, personalized sales outreach, multilingual content.

**Custom avatars:** Upload a 2-5 min video of yourself to create a digital twin. Looks and sounds like you, generates videos from text scripts.

### Synthesia

Full-body avatars with expressive body language. Built-in script generation from URLs/docs.

**Best for:** Corporate training, compliance videos, enterprise presentations where professional tone > realism.

### When to Use Avatars vs. Other Approaches

| Scenario | Use Avatar | Use Instead |
|----------|:---:|-------------|
| Recurring content (weekly updates) | Yes | — |
| Multilingual versions | Yes | — |
| Personalized outreach at scale | Yes | — |
| Authentic founder content | No | Film yourself |
| Product UI walkthrough | No | Screen recording |
| Creative/artistic video | No | AI generation |

---

## Editing & Repurposing Tools

Turn existing content into multiple video formats.

| Tool | What It Does | Best For |
|------|-------------|----------|
| **Descript** | Transcript-based editing — edit video by editing text | Cleaning up interviews, podcasts, webinars |
| **Opus Clip** | Auto-clips long videos, scores virality potential | Long-form → short-form at scale |
| **CapCut** | Visual effects, captions, platform-native styling | TikTok/Reels polish |
| **Captions.ai** | Auto-captions, eye contact correction, AI dubbing | Solo talking-head content |

### Repurposing Workflow

```
Long-form content (podcast, webinar, demo)
    ↓
Descript: Clean up, remove filler, polish
    ↓
Opus Clip: Auto-extract 5-10 best moments
    ↓
CapCut: Add captions, effects, platform styling
    ↓
Distribute: TikTok, Reels, Shorts, LinkedIn
=======
**Melhor para:** Animações complexas, pré-visualizações interativas, renderização em lote em grande escala (Lambda).

### Quando Escolher Qual

| Fator | Hyperframes | Remotion |
|-------|-------------|----------|
| Compatibilidade com agente | Melhor (HTML puro) | Bom (React) |
| Complexidade de animação | Básica (transições CSS) | Avançada (Spring, interpolate) |
| Renderização em lote | Local | Lambda (AWS) para escala |
| Curva de aprendizado | Mínima | Moderada |
| Licença | Apache 2.0 | Licença comercial |

---

## Geração de Vídeo com IA

| Modelo | Resolução | Duração Máxima | Melhor Para | Custo |
|--------|-----------|----------------|-------------|-------|
| **Veo 3** (Google) | Até 1080p | Variável | Máxima qualidade, áudio sincronizado | Via API |
| **Runway Gen-4** | Até 4K | ~10 seg/geração | Controle de movimento | $12-76/mês |
| **Kling 3.0** | Até 1080p | Até 2 min | Produção em volume | $0,029/seg |
| **Pika** | 1080p | Clipes curtos | Geração rápida | Por crédito |

### Prompts para Modelos de Vídeo

Bons prompts especificam: **assunto + ação + câmera + estilo + clima**

```
Plano fechado de mãos digitando no teclado de um laptop,
profundidade de campo rasa, luz quente de escritório,
câmera recua lentamente revelando workspace moderno,
correction de cor cinemática, 4K
```

**Erros comuns:**
- Muito vago — adicione especificidades
- Ignorar movimento de câmera — especifique dolly, pan, estático
- Esquecer o estilo — "cinemático", "documentário", "comercial"
- Solicitar texto no vídeo — modelos de IA têm dificuldade com texto legível

---

## Avatares de IA

### HeyGen (recomendado — tem servidor MCP)

Melhor lip-sync e micro-expressões. 230+ avatares, 140+ idiomas.

**Integração com agente:** HeyGen tem servidor MCP oficial — agentes de IA podem gerar vídeos com avatar diretamente.

| Plano | Vídeos | Duração |
|-------|--------|----------|
| Gratuito | 3/mês | 3 min máx |
| Creator | Ilimitado | 5 min |
| Business | Ilimitado | 20 min |

**Melhor para:** Explainers de produto, anúncios de features, outreach de vendas personalizado, conteúdo multilíngue.

### Synthesia

Avatares de corpo inteiro com linguagem corporal expressiva. Geração de roteiro integrada a partir de URLs/docs.

**Melhor para:** Treinamento corporativo, vídeos de compliance, apresentações enterprise.

---

## Ferramentas de Edição e Reaproveitamento

| Ferramenta | O Que Faz | Melhor Para |
|------------|-----------|-------------|
| **Descript** | Edição baseada em transcrição | Limpeza de entrevistas, podcasts, webinars |
| **Opus Clip** | Auto-clipes de vídeos longos, pontua viralidade | Formato longo → curto em escala |
| **CapCut** | Efeitos visuais, legendas, estilo nativo das plataformas | Polish TikTok/Reels |
| **Captions.ai** | Legendas automáticas, correção de contato visual | Conteúdo solo talking-head |

### Fluxo de Reaproveitamento

```
Conteúdo longo (podcast, webinar, demo)
    ↓
Descript: Limpeza, remoção de vícios de linguagem
    ↓
Opus Clip: Auto-extrair 5-10 melhores momentos
    ↓
CapCut: Adicionar legendas, efeitos, estilo de plataforma
    ↓
Distribuir: TikTok, Reels, Shorts, LinkedIn
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
```

---

<<<<<<< HEAD
## Video Production Workflows

### Product Demo Video

1. **Script** the key features and value props (use copywriting skill)
2. **Screen record** the product flow
3. **Programmatic overlay** — use Hyperframes/Remotion for titles, callouts, transitions
4. **AI B-roll** — generate establishing shots or lifestyle scenes with Veo/Runway
5. **Voiceover** — record yourself or use AI avatar for narration
6. **Export** at platform-appropriate specs

### Explainer Video

1. **Script** the problem → solution → CTA arc
2. **Choose presenter** — AI avatar (HeyGen) or voiceover + visuals
3. **Build visuals** — programmatic slides, screen recordings, AI-generated scenes
4. **Add captions** — always, for accessibility and engagement
5. **Export** — landscape for YouTube/website, vertical for social

### Batch Social Clips

1. **Create master template** in Hyperframes/Remotion
2. **Feed data** — product features, testimonials, stats
3. **Render batch** — one template, many variations
4. **Add platform-specific captions** via CapCut or Captions.ai
5. **Schedule** across platforms

---

## Agent-Native Video Pipeline

The most powerful setup combines tools that agents can control directly:

```
Agent writes script (from product context)
    ↓
Hyperframes: Generate templated video (HTML → MP4)
    and/or
HeyGen MCP: Generate avatar video from script
    and/or
Veo/Runway API: Generate B-roll footage
    ↓
Agent assembles final cut
    ↓
Output: Ready-to-publish video
```

**What makes this agent-native:**
- Hyperframes uses HTML — any coding agent can generate it
- HeyGen MCP server — agents call it directly
- Video model APIs — standard HTTP requests
- No manual editing step required

---

## Common Mistakes

1. **Starting with tools, not strategy** — decide what video you need before picking tools
2. **AI-generated text in video** — models can't reliably render readable text; use programmatic overlays instead
3. **Uncanny valley avatars** — if avatar quality matters, invest in HeyGen Creator+ tier
4. **No captions** — 85% of social video is watched without sound
5. **Wrong aspect ratio** — 9:16 for social, 16:9 for YouTube/website, 1:1 for feeds
6. **Over-producing** — authentic often outperforms polished, especially on TikTok

---

## Task-Specific Questions

1. What type of video do you need? (Demo, explainer, social clip, ad, tutorial)
2. Do you need a human presenter or can it be voiceover/text?
3. Is this a one-off or a repeatable template?
4. What platform is it for? (This determines aspect ratio and length)
5. Do you have existing assets to work with? (Screenshots, footage, scripts)
6. What's your budget for video tools?

---

## Tool Integrations

| Tool | Type | MCP | Guide |
|------|------|:---:|-------|
| **HeyGen** | AI avatars | Yes | [heygen.md](../../tools/integrations/heygen.md) |
| **Hyperframes** | Programmatic video | - | [hyperframes.md](../../tools/integrations/hyperframes.md) |
| **Remotion** | Programmatic video | - | [remotion.dev](https://www.remotion.dev/docs) |
| **Runway** | AI generation | - | [runwayml.com/docs](https://docs.dev.runwayml.com) |

---

## Related Skills

- **social-content**: For video content strategy, hooks, and what to post
- **ad-creative**: For paid video ad creative and iteration
- **copywriting**: For video scripts and messaging
- **marketing-psychology**: For hooks and persuasion in video
=======
## Workflows de Produção

### Vídeo de Demo de Produto

1. **Roteirize** os principais recursos e proposta de valor
2. **Grave a tela** do fluxo do produto
3. **Overlay programático** — use Hyperframes/Remotion para títulos, callouts, transições
4. **B-roll com IA** — gere cenas de abertura ou lifestyle com Veo/Runway
5. **Narrador** — grave você mesmo ou use avatar de IA para narração
6. **Exporte** nas especificações da plataforma

### Vídeo Explainer

1. **Roteirize** o arco problema → solução → CTA
2. **Escolha apresentador** — avatar de IA (HeyGen) ou narrador + visuais
3. **Construa visuais** — slides programáticos, gravações de tela, cenas geradas
4. **Adicione legendas** — sempre, para acessibilidade e engajamento
5. **Exporte** — paisagem para YouTube/site, vertical para social

### Clipes Sociais em Lote

1. **Crie template mestre** no Hyperframes/Remotion
2. **Alimente dados** — recursos de produto, depoimentos, estatísticas
3. **Renderize em lote** — um template, muitas variações
4. **Adicione legendas específicas** por plataforma via CapCut ou Captions.ai
5. **Agende** nas plataformas

---

## Pipeline de Vídeo Nativo para Agentes

```
Agente escreve roteiro (a partir do contexto do produto)
    ↓
Hyperframes: Gera vídeo baseado em template (HTML → MP4)
    e/ou
HeyGen MCP: Gera vídeo com avatar a partir do roteiro
    e/ou
Veo/Runway API: Gera B-roll
    ↓
Agente monta corte final
    ↓
Saída: Vídeo pronto para publicar
```

---

## Erros Comuns

1. **Começar com ferramentas, não com estratégia** — decida que vídeo precisa antes de escolher ferramentas
2. **Texto gerado por IA no vídeo** — modelos não renderizam texto legível; use overlays programáticos
3. **Avatares com uncanny valley** — se qualidade importa, invista no tier Creator+ do HeyGen
4. **Sem legendas** — 85% dos vídeos sociais são assistidos sem som
5. **Proporção errada** — 9:16 para social, 16:9 para YouTube/site, 1:1 para feeds
6. **Superproduzir** — autêntico frequentemente supera polido, especialmente no TikTok

---

## Perguntas Específicas da Tarefa

1. Que tipo de vídeo você precisa? (Demo, explainer, clipe social, anúncio, tutorial)
2. Precisa de apresentador humano ou pode ser narrador/texto?
3. É único ou um template repetido?
4. Para qual plataforma? (Determina proporção e duração)
5. Tem assets existentes? (Screenshots, imagens, roteiros)
6. Qual seu orçamento para ferramentas de vídeo?

---

## Integrações de Ferramentas

| Ferramenta | Tipo | MCP | Guia |
|------------|------|:---:|------|
| **HeyGen** | Avatares IA | Sim | [heygen.md](../../tools/integrations/heygen.md) |
| **Hyperframes** | Vídeo programático | - | [hyperframes.md](../../tools/integrations/hyperframes.md) |
| **Remotion** | Vídeo programático | - | [remotion.dev](https://www.remotion.dev/docs) |
| **Runway** | Geração com IA | - | [runwayml.com/docs](https://docs.dev.runwayml.com) |

---

## Skills Relacionadas

- **Conteúdo para Redes Sociais**: Para estratégia de vídeo e o que postar
- **ad-creative**: Para creative de anúncio em vídeo pago
- **Redação Persuasiva**: Para roteiros de vídeo e mensagens
- **Psicologia de Marketing**: Para hooks e persuasividade em vídeo
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
