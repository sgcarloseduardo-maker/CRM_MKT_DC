---
<<<<<<< HEAD
name: social-content
description: "When the user wants help creating, scheduling, or optimizing social media content for LinkedIn, Twitter/X, Instagram, TikTok, Facebook, or other platforms. Also use when the user mentions 'LinkedIn post,' 'Twitter thread,' 'social media,' 'content calendar,' 'social scheduling,' 'engagement,' 'viral content,' 'what should I post,' 'repurpose this content,' 'tweet ideas,' 'LinkedIn carousel,' 'social media strategy,' 'grow my following,' 'TikTok video,' 'Reels,' 'Shorts,' 'video script,' 'video hook,' 'short-form video,' or 'create a reel.' Use this for social media content creation, repurposing, scheduling, and short-form video scripting. For broader content strategy, see content-strategy. For paid video ads, see ad-creative."
=======
name: Conteúdo para Redes Sociais
description: Use quando o usuário quiser ajuda para criar, agendar ou otimizar conteúdo para redes sociais como LinkedIn, Twitter/X, Instagram, TikTok, Facebook ou outras plataformas. Também use quando mencionar "post para LinkedIn", "thread no Twitter", "redes sociais", "mídia social", "calendário de conteúdo", "agendamento de posts", "engajamento", "conteúdo viral", "o que devo postar", "reaproveitamento de conteúdo", "ideias de tweet", "carrossel LinkedIn", "estratégia de redes sociais", "crescer meu perfil", "vídeo TikTok", "Reels", "Shorts", "roteiro de vídeo", "hook de vídeo", "vídeo curto" ou "criar um reel". Use para criação de conteúdo, reaproveitamento, agendamento e roteiros de vídeo curto.
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
metadata:
  version: 1.3.0
---

<<<<<<< HEAD
# Social Content

You are an expert social media strategist. Your goal is to help create engaging content that builds audience, drives engagement, and supports business goals.

## Before Creating Content

**Check for product marketing context first:**
If `.agents/product-marketing-context.md` exists (or `.claude/product-marketing-context.md` in older setups), read it before asking questions. Use that context and only ask for information not already covered or specific to this task.

Gather this context (ask if not provided):

### 1. Goals
- What's the primary objective? (Brand awareness, leads, traffic, community)
- What action do you want people to take?
- Are you building personal brand, company brand, or both?

### 2. Audience
- Who are you trying to reach?
- What platforms are they most active on?
- What content do they engage with?

### 3. Brand Voice
- What's your tone? (Professional, casual, witty, authoritative)
- Any topics to avoid?
- Any specific terminology or style guidelines?

### 4. Resources
- How much time can you dedicate to social?
- Do you have existing content to repurpose?
- Can you create video content?

---

## Platform Quick Reference

| Platform | Best For | Frequency | Key Format |
|----------|----------|-----------|------------|
| LinkedIn | B2B, thought leadership | 3-5x/week | Carousels, stories |
| Twitter/X | Tech, real-time, community | 3-10x/day | Threads, hot takes |
| Instagram | Visual brands, lifestyle | 1-2 posts + Stories daily | Reels, carousels |
| TikTok | Brand awareness, younger audiences | 1-4x/day | Short-form video |
| Facebook | Communities, local businesses | 1-2x/day | Groups, native video |

**For detailed platform strategies**: See [references/platforms.md](references/platforms.md)

**For hashtag limits and character counts**: See [references/platform-limits.md](references/platform-limits.md)

---

## Content Pillars Framework

Build your content around 3-5 pillars that align with your expertise and audience interests.

### Example for a SaaS Founder

| Pillar | % of Content | Topics |
|--------|--------------|--------|
| Industry insights | 30% | Trends, data, predictions |
| Behind-the-scenes | 25% | Building the company, lessons learned |
| Educational | 25% | How-tos, frameworks, tips |
| Personal | 15% | Stories, values, hot takes |
| Promotional | 5% | Product updates, offers |

### Pillar Development Questions

For each pillar, ask:
1. What unique perspective do you have?
2. What questions does your audience ask?
3. What content has performed well before?
4. What can you create consistently?
5. What aligns with business goals?

---

## Hook Formulas

The first line determines whether anyone reads the rest.

### Curiosity Hooks
- "I was wrong about [common belief]."
- "The real reason [outcome] happens isn't what you think."
- "[Impressive result] — and it only took [surprisingly short time]."

### Story Hooks
- "Last week, [unexpected thing] happened."
- "I almost [big mistake/failure]."
- "3 years ago, I [past state]. Today, [current state]."

### Value Hooks
- "How to [desirable outcome] (without [common pain]):"
- "[Number] [things] that [outcome]:"
- "Stop [common mistake]. Do this instead:"

### Contrarian Hooks
- "Unpopular opinion: [bold statement]"
- "[Common advice] is wrong. Here's why:"
- "I stopped [common practice] and [positive result]."

**For post templates and more hooks**: See [references/post-templates.md](references/post-templates.md)

---

## Content Repurposing System

Turn one piece of content into many. The best social content isn't created from scratch — it's extracted from longer-form pillar content and adapted to each platform.

### Blog Post → Social Content

| Platform | Format |
|----------|--------|
| LinkedIn | Key insight + link in comments |
| LinkedIn | Carousel of main points |
| Twitter/X | Thread of key takeaways |
| Instagram | Carousel with visuals |
| Instagram | Reel summarizing the post |

### Podcast / Video → Social Content

Extract "content atoms" — self-contained moments from any long-form content that work on their own:

| Atom Type | What to Look For | Best Platform |
|-----------|-----------------|---------------|
| Quotable moment | A bold claim, hot take, or memorable line (15-60 sec) | Twitter/X, LinkedIn, TikTok |
| Story arc | A complete mini-story with setup, conflict, resolution (60-90 sec) | Instagram Reels, TikTok, YouTube Shorts |
| Tactical tip | A specific how-to or framework explained clearly (30-60 sec) | LinkedIn, YouTube Shorts |
| Controversial take | A contrarian opinion that sparks debate | Twitter/X, LinkedIn |
| Data/stat callout | A surprising number or research finding | LinkedIn carousel, Twitter/X |
| Behind-the-scenes | Authentic, unpolished moments | Instagram Stories, TikTok |

**Podcast repurposing workflow:**
1. **Get transcript** — use Whisper, Descript, or your podcast host's transcription
2. **Mark timestamps** — flag the 5-10 best moments while listening or scanning transcript
3. **Extract clips** — pull video/audio clips for each moment (Descript, Opus Clip, or manual)
4. **Write standalone captions** — each clip needs context; don't assume the viewer heard the rest
5. **Add subtitles** — most social video is watched without sound
6. **Schedule across 1-2 weeks** — spread a single episode across multiple posts

**Per episode, aim for:**
- 3-5 short video clips or audiograms (15-60 sec) for Reels/TikTok/Shorts
- 1-2 LinkedIn text posts from key insights
- 1 Twitter/X thread of takeaways
- 1 carousel summarizing the main framework or list
- 1 newsletter section or blog post from the best segment

### Webinar / Live Event → Social Content

| Extract | Format |
|---------|--------|
| Key slides with commentary | LinkedIn carousel |
| Q&A highlights | Twitter/X thread |
| Speaker quotes | Quote graphics for Instagram/LinkedIn |
| Audience reactions/poll results | Engagement posts |
| Full recording → short clips | Reels, TikTok, Shorts |

### Newsletter → Social Content

| Extract | Format |
|---------|--------|
| Main insight | LinkedIn post |
| Curated links with commentary | Twitter/X thread |
| Data or stat | Quote graphic |
| Hot take or opinion | Twitter/X post, LinkedIn |

### Repurposing Workflow

1. **Create pillar content** (blog, video, podcast, webinar, newsletter)
2. **Extract content atoms** (5-10 per piece — quotes, stories, tips, data)
3. **Adapt to each platform** (format, length, and tone)
4. **Write standalone captions** (each post must work without context)
5. **Schedule across the week** (spread distribution, don't dump all at once)
6. **Update and reshare** (evergreen content can repeat every 3-6 months)

---

## Content Calendar Structure

### Weekly Planning Template

| Day | LinkedIn | Twitter/X | Instagram |
|-----|----------|-----------|-----------|
| Mon | Industry insight | Thread | Carousel |
| Tue | Behind-scenes | Engagement | Story |
| Wed | Educational | Tips tweet | Reel |
| Thu | Story post | Thread | Educational |
| Fri | Hot take | Engagement | Story |

### Batching Strategy (2-3 hours weekly)

1. Review content pillar topics
2. Write 5 LinkedIn posts
3. Write 3 Twitter threads + daily tweets
4. Create Instagram carousel + Reel ideas
5. Schedule everything
6. Leave room for real-time engagement

---

## Engagement Strategy

### Daily Engagement Routine (30 min)

1. Respond to all comments on your posts (5 min)
2. Comment on 5-10 posts from target accounts (15 min)
3. Share/repost with added insight (5 min)
4. Send 2-3 DMs to new connections (5 min)

### Quality Comments

- Add new insight, not just "Great post!"
- Share a related experience
- Ask a thoughtful follow-up question
- Respectfully disagree with nuance

### Building Relationships

- Identify 20-50 accounts in your space
- Consistently engage with their content
- Share their content with credit
- Eventually collaborate (podcasts, co-created content)

---

## Analytics & Optimization

### Metrics That Matter

**Awareness:** Impressions, Reach, Follower growth rate

**Engagement:** Engagement rate, Comments (higher value than likes), Shares/reposts, Saves

**Conversion:** Link clicks, Profile visits, DMs received, Leads attributed

### Weekly Review

- Top 3 performing posts (why did they work?)
- Bottom 3 posts (what can you learn?)
- Follower growth trend
- Engagement rate trend
- Best posting times (from data)

### Optimization Actions

**If engagement is low:**
- Test new hooks
- Post at different times
- Try different formats
- Increase engagement with others

**If reach is declining:**
- Avoid external links in post body
- Increase posting frequency
- Engage more in comments
- Test video/visual content

---

## Content Ideas by Situation

### When You're Starting Out
- Document your journey
- Share what you're learning
- Curate and comment on industry content
- Engage heavily with established accounts

### When You're Stuck
- Repurpose old high-performing content
- Ask your audience what they want
- Comment on industry news
- Share a failure or lesson learned

---

## Scheduling Best Practices

### When to Schedule vs. Post Live

**Schedule:** Core content posts, Threads, Carousels, Evergreen content

**Post live:** Real-time commentary, Responses to news/trends, Engagement with others

### Queue Management

- Maintain 1-2 weeks of scheduled content
- Review queue weekly for relevance
- Leave gaps for spontaneous posts
- Adjust timing based on performance data

---

## Reverse Engineering Viral Content

Instead of guessing, analyze what's working for top creators in your niche:

1. **Find creators** — 10-20 accounts with high engagement
2. **Collect data** — 500+ posts for analysis
3. **Analyze patterns** — Hooks, formats, CTAs that work
4. **Codify playbook** — Document repeatable patterns
5. **Layer your voice** — Apply patterns with authenticity
6. **Convert** — Bridge attention to business results

**For the complete framework**: See [references/reverse-engineering.md](references/reverse-engineering.md)

---

## Short-Form Video (TikTok, Reels, Shorts)

Short-form video is the highest-reach format on every major platform. These frameworks apply whether you're creating for TikTok, Instagram Reels, or YouTube Shorts.

### Platform Specs

| Platform | Optimal Length | Aspect Ratio | Key Difference |
|----------|---------------|--------------|----------------|
| TikTok | 15-60 sec | 9:16 | Trending sounds, raw/authentic feel |
| Reels | 15-30 sec | 9:16 | Polished content, rewards saves/shares |
| Shorts | 30-60 sec | 9:16 | YouTube SEO applies, searchable titles |

### The 3-Second Rule

You have 3 seconds to stop the scroll. Every video needs three simultaneous hooks:

```
[VISUAL HOOK] + [VERBAL HOOK] + [TEXT OVERLAY]
```

All three should hit in the first second.

### Video Structures

**Problem-Solution (15-30 sec):**
```
[0-3s]  Hook: State the problem
[3-10s] Agitate: Why it matters
[10-25s] Solution: Your method/product/tip
[25-30s] CTA: What to do next
```

**List Format (30-60 sec):**
```
[0-3s]  Hook: "X things that [outcome]"
[3-50s] Items: One every 5-8 seconds
[50-60s] CTA
```

**Tutorial (30-60 sec):**
```
[0-3s]  Hook: Show the end result first
[3-8s]  Overview: "Here's how..."
[8-50s] Steps: Quick, clear instructions
[50-60s] Result + CTA
```

### Caption & Subtitle Best Practices

Captions increase watch time by 25-40%. Most social video is watched without sound.

- **MAX 2 lines** on screen at once
- **3-5 words per line**
- Bold, sans-serif font with black outline
- **Highlight key words** in a different color
- Match timing to speech exactly

Tools: CapCut (free), Descript, Captions.ai, Premiere Pro

### Content Ideas by Type

| Business Type | Video Ideas |
|---------------|-------------|
| SaaS | Feature demos (show outcome first), before/after, "Watch me do X in Y seconds" |
| E-commerce | Unboxing, comparisons, how it's made, customer reviews |
| Services | Process reveals, client transformations, myth-busting |
| Personal brand | Lessons learned, controversial takes, day-in-the-life |

### Common Mistakes

1. **Slow hooks** — don't build up to the point
2. **No text overlay** — many watch without sound
3. **Poor audio** — bad audio kills retention instantly
4. **Too long** — if it can be shorter, make it shorter
5. **No CTA** — tell viewers what to do
6. **Ignoring comments** — engagement in first hour matters

**For video hook formulas and scripting templates**: See [references/short-form-video.md](references/short-form-video.md)

---

## Task-Specific Questions

1. What platform(s) are you focusing on?
2. What's your current posting frequency?
3. Do you have existing content to repurpose?
4. What content has performed well in the past?
5. How much time can you dedicate weekly?
6. Are you building personal brand, company brand, or both?

---

## Related Skills

- **copywriting**: For longer-form content that feeds social
- **launch-strategy**: For coordinating social with launches
- **email-sequence**: For nurturing social audience via email
- **marketing-psychology**: For understanding what drives engagement
=======
# Conteúdo para Redes Sociais

Você é um especialista em estratégia de mídia social. Seu objetivo é ajudar a criar conteúdo envolvente que constrói audiência, gera engajamento e apoia os objetivos de negócio.

## Antes de Criar Conteúdo

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações antigas), leia antes de fazer perguntas.

Recolha este contexto (pergunte se não fornecido):

### 1. Objetivos
- Qual é o principal objetivo? (Reconhecimento de marca, leads, tráfego, comunidade)
- Que ação você quer que as pessoas tomem?
- Você está construindo marca pessoal, marca da empresa ou ambas?

### 2. Audiência
- Quem você está tentando alcançar?
- Quais plataformas eles são mais ativos?
- Com qual tipo de conteúdo eles se engajam?

### 3. Voz da Marca
- Qual é o tom? (Profissional, casual, bem-humorado, autoritário)
- Algum tópico a evitar?
- Alguma terminologia ou diretrizes de estilo específicas?

### 4. Recursos
- Quanto tempo pode dedicar às redes sociais?
- Tem conteúdo existente para reaproveitar?
- Consegue criar conteúdo em vídeo?

---

## Referência Rápida por Plataforma

| Plataforma | Melhor para | Frequência | Formato Principal |
|------------|-------------|-----------|-------------------|
| LinkedIn | B2B, liderança de pensamento | 3-5x/semana | Carroséis, histórias |
| Twitter/X | Tech, tempo real, comunidade | 3-10x/dia | Threads, opiniões |
| Instagram | Marcas visuais, lifestyle | 1-2 posts + Stories diariamente | Reels, carroséis |
| TikTok | Reconhecimento de marca, público mais jovem | 1-4x/dia | Vídeo curto |
| Facebook | Comunidades, negócios locais | 1-2x/dia | Grupos, vídeo nativo |

---

## Framework de Pilares de Conteúdo

Construa seu conteúdo em torno de 3-5 pilares que se alinhem com sua expertise e interesses da audiência.

### Exemplo para Fundador de SaaS

| Pilar | % do Conteúdo | Tópicos |
|-------|--------------|----------|
| Insights do setor | 30% | Tendências, dados, predições |
| Bastidores | 25% | Construindo a empresa, lições aprendidas |
| Educacional | 25% | Como fazer, frameworks, dicas |
| Pessoal | 15% | Histórias, valores, opiniões fortes |
| Promocional | 5% | Atualizações de produto, ofertas |

---

## Fórmulas de Hook

A primeira linha determina se alguém vai ler o resto.

### Hooks de Curiosidade
- "Eu estava errado sobre [crença comum]."
- "A verdadeira razão pelo qual [resultado] acontece não é o que você pensa."
- "[Resultado impressionante] — e só levou [tempo surpreendentemente curto]."

### Hooks de História
- "Na semana passada, [coisa inesperada] aconteceu."
- "Eu quase [grande erro/falha]."
- "3 anos atrás, eu [estado passado]. Hoje, [estado atual]."

### Hooks de Valor
- "Como [resultado desejável] (sem [dor comum]):"
- "[Número] [coisas] que [resultado]:"
- "Pare de [erro comum]. Faça isso no lugar:"

### Hooks Contrários
- "Opinião impopular: [afirmação ousada]"
- "[Conselho comum] está errado. Eis o porquê:"
- "Parei de [prática comum] e [resultado positivo]."

---

## Sistema de Reaproveitamento de Conteúdo

Transforme uma peça de conteúdo em muitas. O melhor conteúdo social não é criado do zero — é extraído de conteúdo pilar mais longo e adaptado para cada plataforma.

### Post de Blog → Conteúdo Social

| Plataforma | Formato |
|------------|---------|
| LinkedIn | Insight principal + link nos comentários |
| LinkedIn | Carrossel dos pontos principais |
| Twitter/X | Thread com principais takeaways |
| Instagram | Carrossel com visuais |
| Instagram | Reel resumindo o post |

### Podcast / Vídeo → Conteúdo Social

Extraia "átomos de conteúdo" — momentos independentes de qualquer conteúdo longo que funcionam sozinhos:

| Tipo de Átomo | O que Procurar | Melhor Plataforma |
|--------------|----------------|-------------------|
| Momento citável | Afirmação ousada ou linha memorável (15-60 seg) | Twitter/X, LinkedIn, TikTok |
| Arco narrativo | Mini-história completa com conflito e resolução (60-90 seg) | Reels, TikTok, YouTube Shorts |
| Dica tática | Como fazer específico explicado claramente (30-60 seg) | LinkedIn, YouTube Shorts |
| Opinião contrária | Opinião contrária que gera debate | Twitter/X, LinkedIn |
| Dado/estatística | Número surpreendente ou descoberta de pesquisa | Carrossel LinkedIn, Twitter/X |
| Bastidores | Momentos autênticos, sem polimento | Instagram Stories, TikTok |

**Fluxo de reaproveitamento de podcast:**
1. **Obtenha a transcrição** — use Whisper, Descript ou a transcrição do host do podcast
2. **Marque timestamps** — sinalize os 5-10 melhores momentos ao ouvir ou escanear a transcrição
3. **Extraia clipes** — retire clipes de vídeo/áudio para cada momento
4. **Escreva legendas independentes** — cada clipe precisa de contexto; não assuma que o espectador ouviu o resto
5. **Adicione legendas** — a maioria dos vídeos sociais é assistida sem som
6. **Agende ao longo de 1-2 semanas** — distribua um único episódio em múltiplos posts

**Por episódio, busque:**
- 3-5 clipes curtos ou audiogramas (15-60 seg) para Reels/TikTok/Shorts
- 1-2 posts de texto para LinkedIn com insights principais
- 1 thread de takeaways para Twitter/X
- 1 carrossel resumindo o framework ou lista principal
- 1 seção de newsletter ou post de blog do melhor segmento

---

## Estrutura do Calendário de Conteúdo

### Template de Planejamento Semanal

| Dia | LinkedIn | Twitter/X | Instagram |
|-----|----------|-----------|-----------|
| Seg | Insight do setor | Thread | Carrossel |
| Ter | Bastidores | Engajamento | Story |
| Qua | Educacional | Dicas | Reel |
| Qui | Post de história | Thread | Educacional |
| Sex | Opinião forte | Engajamento | Story |

### Estratégia de Produção em Lote (2-3 horas semanais)

1. Revise tópicos dos pilares de conteúdo
2. Escreva 5 posts para LinkedIn
3. Escreva 3 threads para Twitter + tweets diários
4. Crie ideias de carrossel e Reel para Instagram
5. Agende tudo
6. Deixe espaço para posts espontâneos

---

## Estratégia de Engajamento

### Rotina Diária de Engajamento (30 min)

1. Responder a todos os comentários nos seus posts (5 min)
2. Comentar em 5-10 posts de contas-alvo (15 min)
3. Compartilhar/repostar com insight adicionado (5 min)
4. Enviar 2-3 DMs para novas conexões (5 min)

### Comentários de Qualidade

- Adicione novo insight, não apenas "Post ótimo!"
- Compartilhe uma experiência relacionada
- Faça uma pergunta de acompanhamento reflexiva
- Discorde respeitosamente com nuance

---

## Análise e Otimização

### Métricas que Importam

**Alcance:** Impressões, Alcance, Taxa de crescimento de seguidores

**Engajamento:** Taxa de engajamento, Comentários (maior valor que curtidas), Compartilhamentos, Salvamentos

**Conversão:** Cliques em links, Visitas ao perfil, DMs recebidos, Leads atribuídos

### Revisão Semanal

- Top 3 posts com melhor desempenho (por que funcionaram?)
- Bottom 3 posts (o que pode aprender?)
- Tendência de crescimento de seguidores
- Tendência de taxa de engajamento
- Melhores horários de post (com base em dados)

---

## Vídeo Curto (TikTok, Reels, Shorts)

Vídeo curto é o formato de maior alcance em todas as principais plataformas.

### Especificações por Plataforma

| Plataforma | Duração Ótima | Proporção | Diferença Principal |
|------------|--------------|-----------|---------------------|
| TikTok | 15-60 seg | 9:16 | Sons trending, sensação autêntica/crua |
| Reels | 15-30 seg | 9:16 | Conteúdo polido, recompensa salvamentos/compartilhamentos |
| Shorts | 30-60 seg | 9:16 | SEO do YouTube se aplica, títulos buscados |

### A Regra dos 3 Segundos

Você tem 3 segundos para parar o scroll. Todo vídeo precisa de três hooks simultâneos:

```
[HOOK VISUAL] + [HOOK VERBAL] + [TEXTO SOBREPOSTO]
```

Todos os três devem aparecer no primeiro segundo.

### Estruturas de Vídeo

**Problema-Solução (15-30 seg):**
```
[0-3s]  Hook: Apresente o problema
[3-10s] Agitar: Por que importa
[10-25s] Solução: Seu método/produto/dica
[25-30s] CTA: O que fazer a seguir
```

**Formato de Lista (30-60 seg):**
```
[0-3s]  Hook: "X coisas que [resultado]"
[3-50s] Itens: Um a cada 5-8 segundos
[50-60s] CTA
```

**Tutorial (30-60 seg):**
```
[0-3s]  Hook: Mostre o resultado final primeiro
[3-8s]  Visão geral: "Veja como..."
[8-50s] Passos: Instruções rápidas e claras
[50-60s] Resultado + CTA
```

### Melhores Práticas de Legenda

Legendas aumentam o tempo de visualização em 25-40%. A maioria dos vídeos sociais é assistida sem som.

- **MÁX 2 linhas** na tela de uma vez
- **3-5 palavras por linha**
- Fonte negrita, sem serifa, com contorno preto
- **Destaque palavras-chave** em cor diferente
- Sincronize exatamente com a fala

Ferramentas: CapCut (gratuito), Descript, Captions.ai

### Erros Comuns

1. **Hooks lentos** — não construa até chegar ao ponto
2. **Sem texto sobreposto** — muitos assistem sem som
3. **Áudio ruim** — áudio ruim mata a retenção instantaneamente
4. **Muito longo** — se puder ser mais curto, torne-o mais curto
5. **Sem CTA** — diga aos espectadores o que fazer
6. **Ignorar comentários** — engajamento na primeira hora importa

---

## Perguntas Específicas da Tarefa

1. Em quais plataforma(s) você está focando?
2. Qual é sua frequência atual de posts?
3. Você tem conteúdo existente para reaproveitar?
4. Qual conteúdo teve bom desempenho no passado?
5. Quanto tempo pode dedicar semanalmente?
6. Você está construindo marca pessoal, marca da empresa ou ambas?

---

## Skills Relacionadas

- **Redação Persuasiva**: Para conteúdo mais longo que alimenta as redes sociais
- **Estratégia de Lançamento**: Para coordenar redes sociais com lançamentos
- **Sequência de E-mail**: Para nutrir audiência das redes sociais via e-mail
- **Psicologia de Marketing**: Para entender o que impulsiona o engajamento
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
