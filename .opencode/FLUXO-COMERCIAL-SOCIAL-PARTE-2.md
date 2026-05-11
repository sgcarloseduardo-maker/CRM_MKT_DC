# Fluxo Comercial-Social - Parte 2

## Escopo ativo
Expansao de conteudo para produtos, redes, grupos de venda, prova social, comentarios, reputacao e pesquisa similar.

## Sequencia operacional
1. `product-manager` normaliza produtos e gera metadados basicos.
2. `social-adapter` cria variacoes por rede e publico.
3. `sales-groups-adapter` gera saidas de oferta para WhatsApp e Telegram.
4. Camada de comentarios/prova social sintetiza sinais de duvidas, objecoes e validacoes.
5. Camada de reputacao resume riscos e sinais de resolucao.
6. Camada de pesquisa similar (YouTube e outras fontes publicas) enriquece argumento editorial.
7. `publisher-reviewer` valida formato, compliance e aptidao de pacote para publicacao futura.

## Regras de uso de comentarios e reputacao
- Tratar dados como referencia analitica e editorial.
- Evitar reproducao bruta de terceiros.
- Priorizar sintese, classificacao e aplicacao pratica para decisao de compra.

## Fora de escopo nesta parte
- Metricas avancadas, tracking completo, automacao pesada de publicacao, integracoes externas complexas, banco final.
