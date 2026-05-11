# Fluxo Final Operacional - Parte 3

## Escopo ativo
Tracking, atribuicao, metricas, validacao final e publicacao assistida.

## Sequencia operacional
1. `orchestrator-crm` consolida saidas de conteudo, produto e adaptacao social.
2. Camada de tracking aplica UTM/SubID e valida links por canal e produto.
3. Camada de metricas consolida leitura por periodo, canal, formato, produto e variacao AB.
4. `publisher-reviewer` executa checklist final e bloqueia falhas graves.
5. Camada WordPress organiza fila, categorias/tags, midias e agendamento assistido.
6. `metrics-analyst` registra insights e recomendacoes para ciclo seguinte.

## Saida operacional padrao
- pacote-rastreavel
- status-validacao-final
- fila-publicacao-assistida
- resumo-metricas-operacionais
- insights-priorizados

## Fora de escopo
- tracking enterprise completo
- automacao pesada de publicacao
- integracoes externas complexas
- banco definitivo
