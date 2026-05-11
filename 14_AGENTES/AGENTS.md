# AGENTS - CRM_MKT_DC

## Visao do projeto
Este repositorio abriga o CRM_MKT_DC, uma central operacional de conteudo afiliado da marca Decisao Certa Ferramentas.
Nao e um CRM de clientes. O foco operacional e organizar e acelerar producao, adaptacao, publicacao e analise de conteudo para blog, redes sociais, grupos de venda, produtos, links afiliados, criacao visual, prompts e metricas.

## Objetivo do CRM
Fornecer uma base auditavel, incremental e reutilizavel para:
- planejar e produzir conteudo afiliado,
- adaptar conteudo por canal,
- revisar qualidade e publicacao,
- acompanhar desempenho operacional e resultados.

## Idioma padrao
- PT-BR para documentacao, instrucoes, nomenclatura funcional e comunicacao operacional.

## Regras de execucao
- Trabalhar sempre a partir do escopo base oficial do projeto.
- Preferir solucoes simples, incrementais e auditaveis.
- Evitar mudancas grandes sem validacao explicita.
- Reportar mudancas com objetividade, indicando claramente o que foi alterado.

## Convencoes principais
- Estrutura oficial de automacao em `.opencode/agents/` e `.opencode/skills/`.
- Cada agent deve existir em arquivo markdown individual em `.opencode/agents/`.
- Cada skill deve existir em pasta propria contendo `SKILL.md` em `.opencode/skills/<nome-da-skill>/`.
- Evitar duplicidade de nomes e manter nomenclatura consistente em kebab-case.
- Comecar por fundacao documental e operacional antes de implementacoes amplas.

## Governanca de mudancas
- Nao introduzir integracoes externas sem etapa dedicada.
- Nao antecipar fases futuras do escopo base.
- Preservar artefatos existentes compativeis e corrigir conflitos estruturais sem duplicar.

## Contrato operacional atual (Parte 1)
- Fluxo ativo: entrada de conteudo -> classificacao -> refino SEO -> humanizacao -> versao final-mestre.
- Agent principal de coordenacao: `orchestrator-crm`.
- Refino editorial: `seo-editor`.
- Suporte restrito de produto nesta fase: `product-manager` apenas para reconhecer mencoes de produto no texto.
- Fora de escopo nesta fase: adaptacao para redes sociais, catalogo completo de produtos, publicacao automatizada, metricas e midias visuais.

## Contrato operacional atual (Parte 2)
- Expansao ativa: catalogo de produtos, adaptacao por redes sociais, grupos de venda, prova social, comentarios e reputacao publica.
- Agents foco desta etapa: `product-manager`, `social-adapter`, `sales-groups-adapter`, `creative-director`, `publisher-reviewer`, `metrics-analyst`.
- Comentarios e reputacao devem ser tratados como referencia analitica, com sintese e classificacao, evitando reproducao bruta.
- Fora de escopo nesta fase: metricas avancadas, tracking completo, publicacao automatica completa, integracoes externas complexas e banco final.

## Contrato operacional atual (Parte 3)
- Camada ativa: tracking, atribuicao, metricas operacionais, validacao final e publicacao assistida.
- Coordenacao final do fluxo: `orchestrator-crm`.
- Analise e leitura de dados: `metrics-analyst`.
- Gate de qualidade e prontidao: `publisher-reviewer`.
- `product-manager` e `social-adapter` fornecem saidas compativeis com tracking e publicacao.
- Fora de escopo nesta fase: refatoracao total de arquitetura, tracking avancado de nivel enterprise, automacoes pesadas e banco definitivo.

## Contrato oficial consolidado
- O documento `.opencode/SCHEMA-OPERACIONAL-MESTRE.md` passa a ser a referencia oficial unica de contrato operacional do CRM_MKT_DC.
- Agents, skills, validacoes e futuras integracoes devem seguir esse schema como fonte primaria de verdade.
