# TEMPLATE PADRAO - PACOTE OPERACIONAL FINAL

> Uso: preencher na ordem fixa abaixo, mantendo nomes em snake_case.
> Compatibilidade: alinhado ao `.opencode/SCHEMA-OPERACIONAL-MESTRE.md`.

## 1. identificacao
- conteudo_id: ""
- titulo_bruto: ""
- origem: ""
- autor: ""
- data: ""
- versao: ""
- status_geral: ""  # novo|em_analise|em_refino|aguardando_humanizacao|versao_mestre_pronta|adaptando_canais|aguardando_validacao|aprovado_com_pendencia_leve|pronto_para_publicacao|publicado|monitorando_resultados|pausado|bloqueado

## 2. classificacao_editorial
- tipo_conteudo: ""
- tema: ""
- nicho: ""
- subtipo: ""
- intencao_busca: ""
- funil: ""  # topo|meio|fundo
- suficiencia_material: ""  # suficiente|parcial|insuficiente
- faltantes: []

## 3. seo_estrutura
- palavra_chave_principal: ""
- palavras_chave_secundarias: []
- titulo_seo: ""
- meta_description: ""
- headings:
  - h1: ""
  - h2: []
  - h3: []
- faq: []
- escaneabilidade: ""  # ok|ajustar
- observacoes_editoriais: ""

## 4. humanizacao
- experiencia_real: []
- opiniao_honesta: []
- bastidor: []
- exemplo_pratico: []
- observacoes_autor: ""

## 5. produtos
- produtos_citados: []
- marca: ""
- modelo: ""
- categoria: ""
- uso_principal: ""
- comparativos: []
- elegibilidade_por_canal: {}
- links_afiliados: []
- status_link: ""  # valido|quebrado|pendente_validacao

## 6. social_canais
- saidas_por_canal: {}
- formato_por_canal: {}
- cta_por_canal: {}
- adaptacao_por_publico: {}
- prioridade_por_canal: {}
- observacoes_publicacao: ""

## 7. grupos_venda
- whatsapp: ""
- telegram: ""
- tipo_oferta: ""  # oferta_curta|promocao|alerta|lista_achados
- texto_curto: ""
- cta_direto: ""
- urgencia: ""  # baixa|media|alta
- status_aprovacao: ""

## 8. prova_social_comentarios
- comentarios_blog: []
- comentarios_youtube: []
- comentarios_redes: []
- sentimento: ""
- objecoes: []
- elogios: []
- perguntas_frequentes: []
- trechos_aproveitaveis: []
- score_relevancia: ""

## 9. reputacao_publica
- fonte_publica: ""
- volume_reclamacoes: ""
- principais_problemas: []
- resolucao: ""
- risco_marca: ""  # baixo|medio|alto
- resumo_editorial: ""

## 10. tracking_atribuicao
- utm_source: ""
- utm_medium: ""
- utm_campaign: ""
- subid: ""
- canal: ""
- criativo: ""
- cta: ""
- produto: ""
- status_validacao_link: ""  # valido|quebrado|pendente_validacao

## 11. metricas
- canal: ""
- formato: ""
- alcance: ""
- clique: ""
- ctr: ""
- retencao: ""
- produto_mais_clicado: ""
- criativo_mais_clicado: ""
- versao_comparada: ""
- leitura_desempenho: ""

## 12. validacao_publicacao
- checklist_final: {}
- compliance: ""
- status_aprovacao: ""  # inclui aprovado_com_pendencia_leve quando aplicavel
- fila: ""
- agendamento: ""
- wordpress: ""
- midia: ""
- categorias_tags:
  - categorias: []
  - tags: []
- bloqueios: []
- observacoes_finais: ""

## 13. status_transicoes
- status_oficial: ""
- status_anterior: ""
- proximo_status: ""
- pendencias: []
- bloqueio: false
- observacoes_transicao: ""

## 14. handoff_agents
- orchestrator_crm:
  - entrada: ""
  - saida: ""
  - status: ""
- seo_editor:
  - entrada: ""
  - saida: ""
  - status: ""
- product_manager:
  - entrada: ""
  - saida: ""
  - status: ""
- social_adapter:
  - entrada: ""
  - saida: ""
  - status: ""
- sales_groups_adapter:
  - entrada: ""
  - saida: ""
  - status: ""
- publisher_reviewer:
  - entrada: ""
  - saida: ""
  - status: ""
- metrics_analyst:
  - entrada: ""
  - saida: ""
  - status: ""

## 15. pacote_final
- resumo_executivo: ""
- conclusao: ""
- proximo_uso: ""
- travado_para_reuso: false
- versao_pacote: ""

## Regras rapidas de preenchimento
- Campos criticos obrigatorios: `conteudo_id`, `status_geral`, `versao`, `tipo_conteudo`, `intencao_busca`, `palavra_chave_principal`, `titulo_seo`, `meta_description`, `headings`, `experiencia_real`, `opiniao_honesta`, `bastidor`, `exemplo_pratico`, `saidas_por_canal`, `cta_por_canal`, `checklist_final`, `compliance`, `status_aprovacao`, `fila`, `status_oficial`.
- Para pacote com link: obrigatorio preencher bloco `tracking_atribuicao` completo com `status_validacao_link = valido` para avancar sem bloqueio.
- `aprovado_com_pendencia_leve` so pode ser usado quando criterios criticos estiverem atendidos e pendencia nao for bloqueante.
