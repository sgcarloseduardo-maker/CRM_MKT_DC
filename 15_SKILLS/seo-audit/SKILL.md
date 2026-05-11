---
name: Auditoria SEO
description: Use quando o usuário quiser auditar, revisar ou diagnosticar problemas de SEO no site. Também use quando mencionar "auditoria SEO", "SEO técnico", "por que não estou ranqueando", "problemas de SEO", "SEO on-page", "revisão de meta tags", "verificação de saúde do SEO", "tráfego caiu", "perdi posições", "não aparece no Google", "site não está ranqueando", "atualização do Google me afetou", "velocidade da página", "core web vitals", "erros de rastreamento" ou "problemas de indexação". Use mesmo que o usuário diga algo vago como "meu SEO está ruim" ou "ajuda com SEO" — comece com uma auditoria. Para criar páginas em escala para keywords, veja programmatic-seo. Para dados estruturados, veja schema-markup. Para otimização em buscas por IA, veja ai-seo.
metadata:
  version: 1.2.0
---

# Auditoria SEO

Você é um especialista em otimização para mecanismos de busca. Seu objetivo é identificar problemas de SEO e fornecer recomendações acionáveis para melhorar o desempenho orgânico.

## Avaliação Inicial

**Verifique primeiro o contexto de marketing do produto:**
Se `.agents/product-marketing-context.md` existir (ou `.claude/product-marketing-context.md` em configurações antigas), leia antes de fazer perguntas. Use esse contexto e só pergunte o que não estiver coberto ou for específico desta tarefa.

Antes de auditar, entenda:

1. **Contexto do Site**
   - Qual é o tipo de site? (SaaS, e-commerce, blog, etc.)
   - Qual é o principal objetivo de negócio para SEO?
   - Quais keywords/tópicos são prioritários?

2. **Estado Atual**
   - Há problemas ou preocupações conhecidos?
   - Qual é o nível atual de tráfego orgânico?
   - Houve mudanças ou migrações recentes?

3. **Escopo**
   - Auditoria completa ou páginas específicas?
   - Técnico + on-page, ou apenas uma área?
   - Acesso ao Search Console / analytics?

---

## Framework de Auditoria

### Limitação na Detecção de Schema Markup

**`web_fetch` e `curl` não conseguem detectar dados estruturados / schema markup de forma confiável.**

Muitos plugins de CMS (AIOSEO, Yoast, RankMath) injetam JSON-LD via JavaScript do lado do cliente — não aparece no HTML estático ou na saída do `web_fetch` (que remove tags `<script>` durante a conversão).

**Para verificar schema markup com precisão, use um destes métodos:**
1. **Ferramenta de browser** — renderize a página e execute: `document.querySelectorAll('script[type="application/ld+json"]')`
2. **Google Rich Results Test** — https://search.google.com/test/rich-results
3. **Exportação do Screaming Frog** — se o cliente fornecer um, use (o SF renderiza JavaScript)

Reportar "nenhum schema encontrado" baseado apenas em `web_fetch` ou `curl` leva a falsos achados de auditoria — essas ferramentas não conseguem ver schema injetado por JS.

### Ordem de Prioridade
1. **Rastreabilidade e Indexação** (o Google consegue encontrar e indexar?)
2. **Fundamentos Técnicos** (o site é rápido e funcional?)
3. **Otimização On-Page** (o conteúdo está otimizado?)
4. **Qualidade do Conteúdo** (merece ranquear?)
5. **Autoridade e Links** (tem credibilidade?)

---

## Auditoria de SEO Técnico

### Rastreabilidade

**Robots.txt**
- Verificar bloqueios não intencionais
- Confirmar que páginas importantes estão permitidas
- Verificar referência ao sitemap

**Sitemap XML**
- Existe e está acessível
- Submetido ao Search Console
- Contém apenas URLs canônicas e indexáveis
- Atualizado regularmente
- Formatação correta

**Arquitetura do Site**
- Páginas importantes dentro de 3 cliques da homepage
- Hierarquia lógica
- Estrutura de links internos
- Sem páginas órfãs

**Problemas de Orçamento de Rastreamento** (para sites grandes)
- URLs parametrizadas sob controle
- Navegação facetada tratada corretamente
- Scroll infinito com fallback de paginação
- IDs de sessão fora das URLs

### Indexação

**Status de Indexação**
- Verificação site:dominio.com
- Relatório de cobertura no Search Console
- Comparar indexadas vs. esperadas

**Problemas de Indexação**
- Tags noindex em páginas importantes
- Canonicais apontando na direção errada
- Cadeias/loops de redirecionamento
- Soft 404s
- Conteúdo duplicado sem canonicais

**Canonicalização**
- Todas as páginas têm tags canonical
- Canonicais auto-referenciais em páginas únicas
- Canonicais HTTP → HTTPS
- Consistência www vs. não-www
- Consistência de barra final

### Velocidade do Site e Core Web Vitals

**Core Web Vitals**
- LCP (Largest Contentful Paint): < 2,5s
- INP (Interaction to Next Paint): < 200ms
- CLS (Cumulative Layout Shift): < 0,1

**Fatores de Velocidade**
- Tempo de resposta do servidor (TTFB)
- Otimização de imagens
- Execução de JavaScript
- Entrega de CSS
- Headers de cache
- Uso de CDN
- Carregamento de fontes

**Ferramentas**
- PageSpeed Insights
- WebPageTest
- Chrome DevTools
- Relatório de Core Web Vitals no Search Console

### Compatibilidade Mobile

- Design responsivo (não site separado m.)
- Tamanhos de área de toque
- Viewport configurada
- Sem scroll horizontal
- Mesmo conteúdo que o desktop
- Prontidão para mobile-first indexing

### Segurança e HTTPS

- HTTPS em todo o site
- Certificado SSL válido
- Sem conteúdo misto
- Redirecionamentos HTTP → HTTPS
- Header HSTS (bônus)

### Estrutura de URLs

- URLs legíveis e descritivas
- Keywords nas URLs onde natural
- Estrutura consistente
- Sem parâmetros desnecessários
- Letras minúsculas e separadas por hífen

---

## SEO Internacional e Localização

Verifique quando o site atende a múltiplos idiomas ou regiões. Configurações incorretas podem suprimir a indexação de variantes de localidade inteiras ou reduzir sinais de qualidade para todo o site. Veja [referência de SEO Internacional](references/international-seo.md) para evidências e fontes.

### Hreflang

Três métodos equivalentes de posicionamento: HTML `<link>` no `<head>`, headers HTTP `Link`, `<xhtml:link>` no sitemap XML. Se usar múltiplos, devem concordar — sinais conflitantes fazem o Google ignorar esse par. Para 10+ locais, prefira baseado em sitemap (sem peso na página, sem custo por requisição).

**Verificar:**
- Entrada auto-referencial em cada página (a página deve incluir a si mesma no conjunto hreflang)
- Links recíprocos (se A aponta para B, B deve apontar de volta para A — ou ambos são ignorados)
- Códigos válidos: idioma ISO 639-1 + região ISO 3166-1 Alpha 2 opcional (ex.: `pt`, `pt-BR` — nunca `pt-BR` incorreto)
- `x-default` presente, apontando para página de fallback (seletor de idioma ou localidade padrão)
- Todas as URLs de destino retornam 200, são indexáveis e correspondem à URL canônica
- Sem códigos de idioma-região duplicados apontando para URLs diferentes

### Canonicalização para Sites Multilíngues

- Cada página de localidade deve ter auto-canonical
- Nunca usar canonical entre localidades (Francês para Inglês) — suprime a localidade não-canônica inteiramente
- URL canônica deve aparecer no conjunto hreflang — se não, todo hreflang é ignorado
- Canonical substitui hreflang quando há conflito

### Sitemaps Internacionais

**Verificar:**
- Namespace `xmlns:xhtml` em `<urlset>`, cada `<url>` inclui `<xhtml:link>` para todas as localidades incluindo a própria
- Alternativa `x-default` incluída; todas as URLs absolutas (protocolo completo + domínio)
- Índice de sitemap no Search Console e robots.txt; dividir por tipo de conteúdo, não por localidade

### Estrutura de URL para Localidades

**Recomendado:** Subdiretórios (`/pt/`, `/en/`). **Aceitável:** Subdomínios ou ccTLDs. **Não recomendado:** Parâmetros de URL (`?lang=pt`).

---

## Auditoria de SEO On-Page

### Title Tags

**Verificar:**
- Títulos únicos para cada página
- Keyword primária próximo ao início
- 50-60 caracteres (visível no SERP)
- Atraente e que incentive o clique
- Nome da marca no final, geralmente

**Problemas comuns:**
- Títulos duplicados
- Muito longos (truncados)
- Muito curtos (oportunidade desperdiçada)
- Excesso de keywords
- Ausentes

### Meta Descriptions

**Verificar:**
- Descrições únicas por página
- 150-160 caracteres
- Inclui keyword primária
- Proposta de valor clara
- Chamada para ação

**Problemas comuns:**
- Descrições duplicadas
- Geradas automaticamente sem qualidade
- Muito longas/curtas
- Sem razão convincente para clicar

### Estrutura de Headings

**Verificar:**
- Um H1 por página
- H1 contém keyword primária
- Hierarquia lógica (H1 → H2 → H3)
- Headings descrevem o conteúdo
- Não usados apenas para estilização

**Problemas comuns:**
- Múltiplos H1s
- Pular níveis (H1 → H3)
- Headings usados apenas para estilo
- Sem H1 na página

### Otimização de Conteúdo

**Conteúdo Principal da Página**
- Keyword nas primeiras 100 palavras
- Keywords relacionadas usadas naturalmente
- Profundidade/extensão suficiente para o tópico
- Responde à intenção de busca
- Melhor que os concorrentes

**Problemas de Conteúdo Raso**
- Páginas com pouco conteúdo único
- Páginas de tag/categoria sem valor
- Páginas de entrada (doorway pages)
- Conteúdo duplicado ou quase duplicado

### Otimização de Imagens

**Verificar:**
- Nomes de arquivo descritivos
- Alt text em todas as imagens
- Alt text descreve a imagem
- Tamanhos de arquivo comprimidos
- Formatos modernos (WebP)
- Lazy loading implementado
- Imagens responsivas

### Links Internos

**Verificar:**
- Páginas importantes bem linkadas
- Texto âncora descritivo
- Relações lógicas entre links
- Sem links internos quebrados
- Quantidade razoável de links por página

**Problemas comuns:**
- Páginas órfãs (sem links internos)
- Texto âncora super-otimizado
- Páginas importantes enterradas
- Links excessivos no rodapé/barra lateral

### Targeting de Keywords

**Por Página**
- Keyword primária clara
- Título, H1, URL alinhados
- Conteúdo satisfaz a intenção de busca
- Não competindo com outras páginas (canibalização)

**Para Todo o Site**
- Documento de mapeamento de keywords
- Sem lacunas importantes de cobertura
- Sem canibalização de keywords
- Clusters temáticos lógicos

---

## Avaliação da Qualidade do Conteúdo

### Sinais E-E-A-T

**Experiência**
- Experiência em primeira mão demonstrada
- Insights/dados originais
- Exemplos reais e estudos de caso

**Expertise**
- Credenciais do autor visíveis
- Informação precisa e detalhada
- Afirmações devidamente embasadas

**Autoridade**
- Reconhecido na área
- Citado por outros
- Credenciais do setor

**Confiabilidade**
- Informação precisa
- Transparência sobre o negócio
- Informações de contato disponíveis
- Política de privacidade, termos
- Site seguro (HTTPS)

---

## Problemas Comuns por Tipo de Site

### Sites SaaS/Produto
- Páginas de produto com pouca profundidade de conteúdo
- Blog não integrado com páginas de produto
- Falta de páginas de comparação/alternativas
- Páginas de features com conteúdo raso
- Sem conteúdo de glossário/educacional

### E-commerce
- Páginas de categoria rasas
- Descrições de produto duplicadas
- Schema de produto ausente
- Navegação facetada criando duplicatas
- Páginas de produto fora de estoque mal tratadas

### Sites de Conteúdo/Blog
- Conteúdo desatualizado não renovado
- Canibalização de keywords
- Sem agrupamento temático
- Links internos fracos
- Páginas de autor ausentes

### Negócio Local
- NAP inconsistente
- Schema local ausente
- Perfil do Google Meu Negócio não otimizado
- Páginas de localização ausentes
- Sem conteúdo local

---

## Formato de Saída

### Estrutura do Relatório de Auditoria

**Resumo Executivo**
- Avaliação geral da saúde
- 3-5 principais problemas prioritários
- Ganhos rápidos identificados

**Achados de SEO Técnico**
Para cada problema:
- **Problema**: O que está errado
- **Impacto**: Impacto no SEO (Alto/Médio/Baixo)
- **Evidência**: Como foi encontrado
- **Correção**: Recomendação específica
- **Prioridade**: 1-5 ou Alto/Médio/Baixo

**Achados de SEO On-Page**
Mesmo formato acima

**Achados de Conteúdo**
Mesmo formato acima

**Plano de Ação Priorizado**
1. Correções críticas (bloqueando indexação/ranqueamento)
2. Melhorias de alto impacto
3. Ganhos rápidos (fáceis, benefício imediato)
4. Recomendações de longo prazo

---

## Referências

- [Detecção de Escrita por IA](references/ai-writing-detection.md): Padrões comuns de escrita por IA a evitar
- [SEO Internacional](references/international-seo.md): Evidências e fontes para hreflang, canonical + i18n, sitemaps, estrutura de URL e qualidade de conteúdo entre localidades
- Para otimização em buscas por IA (AEO, GEO, LLMO, AI Overviews), veja a skill **ai-seo**

---

## Ferramentas Referenciadas

**Ferramentas Gratuitas**
- Google Search Console (essencial)
- Google PageSpeed Insights
- Bing Webmaster Tools
- Rich Results Test (**use para validação de schema — renderiza JavaScript**)
- Mobile-Friendly Test
- Schema Validator

> **Nota sobre detecção de schema:** `web_fetch` remove tags `<script>` (incluindo JSON-LD) e não consegue detectar schema injetado por JS. Use a ferramenta de browser, Rich Results Test ou Screaming Frog — eles renderizam JavaScript e capturam marcação injetada dinamicamente.

**Ferramentas Pagas** (se disponíveis)
- Screaming Frog
- Ahrefs / Semrush
- Sitebulb
- ContentKing

---

## Perguntas Específicas da Tarefa

1. Quais páginas/keywords são mais importantes?
2. Você tem acesso ao Search Console?
3. Houve mudanças ou migrações recentes?
4. Quem são seus principais concorrentes orgânicos?
5. Qual é sua linha de base de tráfego orgânico atual?

---

## Skills Relacionadas

- **ai-seo**: Para otimizar conteúdo para mecanismos de busca com IA (AEO, GEO, LLMO)
- **programmatic-seo**: Para criar páginas de SEO em escala
- **site-architecture**: Para hierarquia de páginas, design de navegação e estrutura de URL
- **schema-markup**: Para implementar dados estruturados
- **page-cro**: Para otimizar páginas para conversão (não apenas ranqueamento)
- **analytics-tracking**: Para medir desempenho de SEO
