# CRM_MKT_DC

Base operacional privada para marketing afiliado multicanal.

## Estrutura
- Governança e estratégia: `00_ADMIN` a `02_MARCA`
- Operação de conteúdo e campanhas: `03_PRODUTOS_AFILIADOS` a `10_ANALYTICS`
- Compliance e automações: `11_COMPLIANCE`, `12_AUTOMACOES`
- Aplicação MVP: `13_APP`
- Arquivo de legado: `99_ARQUIVO`
- Ativos de marca organizados: `02_MARCA/*` (detalhes em `02_MARCA/README.md`)
- Assets usados no app: `13_APP/public/brand`

## MVP técnico
- Next.js + TypeScript
- Prisma + SQLite (pronto para migrar para PostgreSQL)
- Foco inicial: dashboard, marca, produtos afiliados, campanhas, canais e Prompts IA

## Setup rápido
1. Copie `.env.example` para `.env`
2. Entre em `13_APP`
3. Instale dependências com `npm install`
4. Rode `npx prisma generate`
5. Rode `npx prisma migrate dev --name init`
6. Rode `npm run dev`

## Observação
Todo legado de locação/cobrança/CRM tradicional foi removido da fundação ativa e movido apenas como referência útil.
