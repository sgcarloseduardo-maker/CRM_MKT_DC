# SCHEMA OPERACIONAL MESTRE - CRM_MKT_DC

## 1) Finalidade
Definir o contrato operacional unico do CRM_MKT_DC para garantir execucao consistente, auditavel e reutilizavel de ponta a ponta: entrada de conteudo, classificacao, refino, humanizacao, produto, canais, prova social, reputacao, tracking, metricas, validacao e publicacao assistida.

## 2) Escopo
Este schema consolida as Partes 1, 2 e 3 ja implementadas no projeto.

Inclui:
- fluxo de conteudo (entrada -> versao final-mestre),
- camada comercial-social (produto, redes, grupos, prova social, reputacao, pesquisa similar),
- camada final operacional (tracking, metricas, validacao final, fila/publicacao assistida).

Nao inclui:
- automacao pesada,
- tracking enterprise completo,
- banco definitivo,
- UI final completa,
- integracoes externas complexas.

## 3) Blocos do schema

### A. Identificacao do projeto/conteudo
Campos:
- `conteudo_id` (obrigatorio)
- `tipo_entrada` (obrigatorio: `texto_colado`, `pdf_extraido`, `documento_interno`)
- `origem` (obrigatorio)
- `data_entrada` (obrigatorio, ISO 8601)
- `autor_responsavel` (obrigatorio)
- `status_geral` (obrigatorio, ver secao 4)
- `versao` (obrigatorio, ex.: `v1`, `v2`)

### B. Classificacao editorial
Campos:
- `tipo_conteudo` (obrigatorio: `artigo_base`, `review`, `comparativo`, `lista`, `review_tecnico`, `artigo_hibrido`)
- `tema` (obrigatorio)
- `nicho` (obrigatorio)
- `subtipo` (opcional)
- `intencao_busca` (obrigatorio)
- `estagio_funil` (obrigatorio: `topo`, `meio`, `fundo`)
- `suficiencia_material` (obrigatorio: `suficiente`, `parcial`, `insuficiente`)
- `faltantes_identificados` (obrigatorio quando `suficiencia_material != suficiente`)

### C. SEO e estrutura
Campos:
- `keyword_principal` (obrigatorio)
- `keywords_secundarias` (obrigatorio, lista minima de 2 quando aplicavel)
- `titulo_seo` (obrigatorio)
- `meta_description` (obrigatorio)
- `headings` (obrigatorio, estrutura H1/H2/H3)
- `faq` (opcional, recomendado para conteudo de objecao)
- `escaneabilidade` (obrigatorio: `ok` ou `ajustar`)
- `observacoes_editoriais` (opcional)

### D. Humanizacao
Campos:
- `pontos_experiencia_real` (obrigatorio, lista)
- `pontos_opiniao_honesta` (obrigatorio, lista)
- `pontos_bastidor` (obrigatorio, lista)
- `pontos_exemplo_pratico` (obrigatorio, lista)
- `observacoes_autor` (opcional)

### E. Produtos
Campos:
- `produtos_citados` (obrigatorio, lista; pode ser vazia quando nao houver)
- `marca` (obrigatorio quando houver produto)
- `modelo` (obrigatorio quando houver produto)
- `categoria` (obrigatorio quando houver produto)
- `uso_principal` (obrigatorio quando houver produto)
- `comparativos` (opcional)
- `elegibilidade_por_canal` (obrigatorio quando houver produto)
- `links_afiliados` (opcional nesta fase)
- `status_link` (obrigatorio quando houver link: `valido`, `quebrado`, `pendente_validacao`)

### F. Social e canais
Campos:
- `saidas_por_canal` (obrigatorio para canais ativos)
- `formato_por_canal` (obrigatorio)
- `cta_por_canal` (obrigatorio)
- `adaptacao_por_publico` (obrigatorio)
- `prioridade_por_canal` (obrigatorio: `alta`, `media`, `baixa`)
- `observacoes_publicacao` (opcional)

### G. Grupos de venda
Campos:
- `whatsapp` (obrigatorio quando canal ativo)
- `telegram` (obrigatorio quando canal ativo)
- `tipo_oferta` (obrigatorio: `oferta_curta`, `promocao`, `alerta`, `lista_achados`)
- `texto_curto` (obrigatorio)
- `cta_direto` (obrigatorio)
- `urgencia` (obrigatorio: `baixa`, `media`, `alta`)
- `status_aprovacao` (obrigatorio)

### H. Prova social e comentarios
Campos:
- `comentarios_blog` (opcional)
- `comentarios_youtube` (opcional)
- `comentarios_redes` (opcional)
- `sentimento` (obrigatorio quando houver comentarios)
- `objecoes` (obrigatorio quando houver comentarios)
- `elogios` (opcional)
- `perguntas_frequentes` (opcional)
- `trechos_aproveitaveis` (obrigatorio em formato sintetico)
- `score_relevancia` (obrigatorio: 0-100)

Regra: comentarios de terceiros sao referencia analitica/editorial; evitar reproducao bruta extensa.

### I. Reputacao publica
Campos:
- `fonte_publica` (obrigatorio quando houver leitura reputacional)
- `volume_reclamacoes` (obrigatorio quando aplicavel)
- `principais_problemas` (obrigatorio quando aplicavel)
- `resolucao` (obrigatorio: sintese de resposta/atendimento)
- `risco_marca` (obrigatorio: `baixo`, `medio`, `alto`)
- `resumo_editorial` (obrigatorio)

### J. Tracking e atribuicao
Campos:
- `utm_source` (obrigatorio para saida com link)
- `utm_medium` (obrigatorio)
- `utm_campaign` (obrigatorio)
- `subid` (obrigatorio para comparacao de variacoes)
- `canal` (obrigatorio)
- `criativo` (obrigatorio)
- `cta` (obrigatorio)
- `produto` (obrigatorio quando houver oferta)
- `status_validacao_link` (obrigatorio: `valido`, `quebrado`, `pendente_validacao`)

### K. Metricas
Campos:
- `canal` (obrigatorio)
- `formato` (obrigatorio)
- `alcance` (obrigatorio quando disponivel)
- `clique` (obrigatorio quando houver link)
- `ctr` (obrigatorio quando houver impressao e clique)
- `retencao` (opcional por canal)
- `produto_mais_clicado` (opcional)
- `criativo_mais_clicado` (opcional)
- `versao_comparada` (obrigatorio para comparativo AB)
- `leitura_desempenho` (obrigatorio, sintese acionavel)

### L. Publicacao e validacao
Campos:
- `checklist_final` (obrigatorio)
- `compliance` (obrigatorio)
- `status_aprovacao` (obrigatorio)
- `fila_publicacao` (obrigatorio)
- `agendamento` (opcional)
- `wordpress` (obrigatorio para blog/site)
- `midia` (opcional nesta fase)
- `categorias_tags` (obrigatorio para blog/site)
- `bloqueios` (obrigatorio quando houver falha grave)
- `observacoes_finais` (opcional)

### M. Status e transicoes
Status oficiais:
- `novo`
- `em_analise`
- `em_refino`
- `aguardando_humanizacao`
- `versao_mestre_pronta`
- `adaptando_canais`
- `aguardando_validacao`
- `aprovado_com_pendencia_leve`
- `pronto_para_publicacao`
- `publicado`
- `monitorando_resultados`
- `pausado`
- `bloqueado`

Transicoes permitidas:
- `novo` -> `em_analise`
- `em_analise` -> `em_refino` ou `bloqueado`
- `em_refino` -> `aguardando_humanizacao`
- `aguardando_humanizacao` -> `versao_mestre_pronta`
- `versao_mestre_pronta` -> `adaptando_canais`
- `adaptando_canais` -> `aguardando_validacao`
- `aguardando_validacao` -> `aprovado_com_pendencia_leve` ou `pronto_para_publicacao` ou `bloqueado`
- `aprovado_com_pendencia_leve` -> `pronto_para_publicacao` ou `aguardando_validacao`
- `pronto_para_publicacao` -> `publicado` ou `pausado`
- `publicado` -> `monitorando_resultados`
- `bloqueado` -> `em_analise` (apos correcao)

Definicao de `aprovado_com_pendencia_leve`:
- Conteudo validado e aproveitavel, com aprovacao editorial concedida.
- Existe pendencia operacional pequena e nao bloqueante.
- Nao pode ser usado quando houver falha grave de compliance, link quebrado ou formato invalido.
- Pode ser atribuido por `publisher-reviewer` no gate final, com registro da pendencia no pacote.

Pendencias que cabem neste status (exemplos):
- atualizacao pontual de disponibilidade no momento do disparo,
- upload manual de midia complementar,
- ajuste curto de agendamento sem impacto de compliance.

Pendencias que nao cabem neste status:
- link com status `quebrado`,
- ausencia de CTA em canal ativo,
- divergencia critica entre produto/oferta e elegibilidade de canal,
- qualquer bloqueio grave de compliance/editorial.

### N. Handoffs entre agents
`orchestrator-crm`
- Entrega: pacote consolidado por etapa, status e pendencias.
- Recebe: saidas de conteudo, produto, social, validacao e metricas.

`seo-editor`
- Recebe: conteudo classificado + lacunas.
- Devolve: titulo SEO, estrutura, meta, keywords, ajustes de escaneabilidade.

`product-manager`
- Recebe: versao em refino/humanizacao com mencoes de produto.
- Devolve: metadados de produto, elegibilidade por canal, base de link e status inicial.

`social-adapter`
- Recebe: versao final-mestre + insumos de produto + tracking base.
- Devolve: saidas por canal, formato e CTA, com campos compativeis com UTM/SubID.

`sales-groups-adapter`
- Recebe: oferta e contexto de produto/canal.
- Devolve: copys curtas para WhatsApp/Telegram, alerta/promocao/lista, CTA direto.

`publisher-reviewer`
- Valida: checklist final, compliance, formato, link, CTA, story-oferta e bloqueios.
- Devolve: `status_aprovacao` + bloqueios e correcoes obrigatorias.

`metrics-analyst`
- Le: tracking, atribuicao, desempenho por canal/produto/criativo.
- Produz: dashboard operacional, comparativos, classificacao de resultados e insights.

### O. Regras de obrigatoriedade
Obrigatorios minimos por etapa:
- Entrada/identificacao: bloco A completo.
- Classificacao: bloco B completo.
- Refino editorial: bloco C completo.
- Humanizacao: bloco D completo.
- Produto: bloco E minimo quando houver mencao/oferta.
- Canais e grupos: blocos F e G para distribuicao.
- Validacao final: bloco L completo.
- Tracking/publicacao com link: bloco J completo + `status_validacao_link = valido`.

Bloqueia avanco:
- ausencia de `conteudo_id`, `status_geral` ou `versao`.
- `suficiencia_material = insuficiente` sem preenchimento de faltantes e revisao.
- `meta_description` ausente ou `headings` inconsistentes.
- ausencia de CTA por canal ativo.
- link com `status_validacao_link = quebrado`.
- falha grave em compliance ou formato.

Pode ficar pendente (sem bloquear automaticamente):
- FAQ,
- midia complementar,
- comparativos de produto,
- campos de retencao quando canal nao fornecer dado.

Exige revisao humana obrigatoria:
- qualquer item marcado como `bloqueado`,
- conteudo com risco reputacional `alto`,
- claims sensiveis de produto/oferta,
- divergencia entre copy e elegibilidade de canal.

Regra adicional para `aprovado_com_pendencia_leve`:
- So permitido quando todos os criterios criticos ja estiverem atendidos.
- A pendencia deve estar explicitamente registrada em `publicacao_validacao.observacoes_finais`.
- Nao gera bloqueio automatico do fluxo.

### P. Pacote final de saida
Modelo unico reutilizavel (`pacote_operacional_final`):
- `identificacao`: bloco A
- `classificacao_editorial`: bloco B
- `seo_estrutura`: bloco C
- `humanizacao`: bloco D
- `produtos`: bloco E
- `social_canais`: bloco F
- `grupos_venda`: bloco G
- `prova_social_comentarios`: bloco H
- `reputacao_publica`: bloco I
- `tracking_atribuicao`: bloco J
- `metricas`: bloco K
- `publicacao_validacao`: bloco L
- `status_transicao`: bloco M
- `handoff_log`: origem, destino, data, responsavel, status

Representacao do status no pacote:
- `identificacao.status_geral`: pode assumir `aprovado_com_pendencia_leve` quando aplicavel.
- `publicacao_validacao.status_aprovacao`: usar `aprovado_com_pendencia_leve` com pendencia descrita.

Saida minima obrigatoria para encerramento de ciclo:
- versao final-mestre,
- pacote rastreavel com links validados,
- status de aprovacao final,
- fila/publicacao assistida,
- leitura de desempenho inicial com proximo ajuste recomendado.

## 4) Status oficiais
Os status oficiais do projeto sao os definidos no bloco M e devem ser aplicados em todos os fluxos e artefatos.

## 5) Regras de validacao
As validacoes operacionais oficiais sao as do bloco O; qualquer automacao futura deve implementar essas mesmas regras antes de liberar `pronto_para_publicacao`.

## 6) Pacote operacional final
O formato oficial e o `pacote_operacional_final` do bloco P. Agents e skills devem produzir/consumir esse formato como contrato comum.

## 7) Observacoes de evolucao futura
- Evoluir para banco e UI sem quebrar nomes e obrigatoriedades deste schema.
- Acrescentar campos novos via versao (`schema_version`) mantendo retrocompatibilidade.
- Integracoes externas futuras devem mapear entrada/saida para os mesmos blocos A-P.
