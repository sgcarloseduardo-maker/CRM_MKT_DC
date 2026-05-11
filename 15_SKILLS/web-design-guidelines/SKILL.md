---
name: Diretrizes de Design Web
description: Revise código de UI para conformidade com as Diretrizes de Interface Web. Use quando solicitado a "revisar minha UI", "verificar acessibilidade", "auditar design", "revisar UX" ou "checar meu site contra as melhores práticas".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <arquivo-ou-padrão>
---

# Diretrizes de Interface Web

Revise arquivos para conformidade com as Diretrizes de Interface Web.

## Como Funciona

1. Busque as diretrizes mais recentes da URL de origem abaixo
2. Leia os arquivos especificados (ou peça ao usuário pelos arquivos/padrão)
3. Verifique contra todas as regras das diretrizes buscadas
4. Apresente os achados no formato conciso `arquivo:linha`

## Fonte das Diretrizes

Busque as diretrizes atualizadas antes de cada revisão:

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

Use WebFetch para recuperar as regras mais recentes. O conteúdo buscado contém todas as regras e instruções de formato de saída.

## Uso

Quando o usuário fornecer um arquivo ou padrão como argumento:
1. Busque as diretrizes da URL de origem acima
2. Leia os arquivos especificados
3. Aplique todas as regras das diretrizes buscadas
4. Apresente os achados usando o formato especificado nas diretrizes

Se nenhum arquivo for especificado, pergunte ao usuário quais arquivos revisar.
