# Campanha Modelo Base - Remocao da Camada Ativa

Origem removida da operacao ativa:
- `00_ADMIN/06_templates_operacionais/campanha_modelo_base/`

Motivo:
- Conteudo com semantica legada de locacao (ex.: retirada, diaria, fechamento de locacao, Casa do Construtor).
- Risco de reutilizacao acidental na operacao diaria do escopo afiliado.

Acao aplicada:
- Arquivos operacionais do modelo legado removidos da pasta ativa.

Diretriz atual:
- Usar apenas os templates atualizados em `00_ADMIN/06_templates_operacionais/` e o contrato em `.opencode/SCHEMA-OPERACIONAL-MESTRE.md`.
