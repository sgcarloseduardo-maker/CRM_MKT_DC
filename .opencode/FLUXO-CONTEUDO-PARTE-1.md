# Fluxo de Conteudo - Parte 1

## Escopo ativo
Entrada de conteudo -> Classificacao -> Refino SEO -> Humanizacao -> Versao final-mestre.

## Sequencia operacional
1. `orchestrator-crm` recebe conteudo bruto (texto colado ou PDF extraido).
2. `intake-conteudo` normaliza material e identifica titulo, subtitulos e corpo.
3. `classificacao-projeto` define tipologia, suficiencia e pontos faltantes.
4. `product-manager` reconhece mencoes de produto, sem catalogacao completa.
5. `seo-editor` executa refino com `seo-refino`, `seo-keywords`, `estrutura-blog` e `meta-description`.
6. Humanizacao com `humanizacao-artigo` e `insercao-experiencia-real`.
7. Consolidacao em `blog-site`: versao final-mestre, registro de aprovacao e referencia oficial.

## Formato de saida padrao
- Resumo do que entrou.
- Classificacao do material.
- Melhorias de SEO aplicadas.
- Pontos de humanizacao sugeridos.
- Versao final-mestre gerada.
- Proximos usos possiveis sem execucao de outras areas.

## Fora de escopo nesta parte
- Redes sociais, catalogo completo de produtos, publicacao automatizada, metricas, imagem e video.
