---
name: Produção de Vídeo com IA
description: Use quando o usuário quiser criar, gerar ou produzir conteúdo em vídeo usando ferramentas de IA ou frameworks programáticos. Também use quando mencionar "produção de vídeo", "vídeo com IA", "Remotion", "Hyperframes", "HeyGen", "Synthesia", "Veo", "Runway", "Kling", "Pika", "geração de vídeo", "avatar IA", "vídeo com apresentador virtual", "vídeo programático", "template de vídeo", "vídeo explainer", "vídeo de demo do produto", "pipeline de vídeo" ou "cria um vídeo pra mim". Use para criação, geração e workflows de produção de vídeo. Para estratégia de conteúdo em vídeo e o que postar, veja conteúdo-redes-sociais. Para creative de anúncio em vídeo pago, veja ad-creative.
metadata:
  version: 1.0.0
---

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

```bash
npm install hyperframes
```

```typescript
import { render } from "hyperframes";

await render({
  frames: [
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

```bash
npx create-video@latest
```

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
```

---

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
