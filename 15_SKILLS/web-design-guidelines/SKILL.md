---
<<<<<<< HEAD
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

## How It Works

1. Fetch the latest guidelines from the source URL below
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the fetched guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Fetch fresh guidelines before each review:
=======
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
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e

```
https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md
```

<<<<<<< HEAD
Use WebFetch to retrieve the latest rules. The fetched content contains all the rules and output format instructions.

## Usage

When a user provides a file or pattern argument:
1. Fetch guidelines from the source URL above
2. Read the specified files
3. Apply all rules from the fetched guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
=======
Use WebFetch para recuperar as regras mais recentes. O conteúdo buscado contém todas as regras e instruções de formato de saída.

## Uso

Quando o usuário fornecer um arquivo ou padrão como argumento:
1. Busque as diretrizes da URL de origem acima
2. Leia os arquivos especificados
3. Aplique todas as regras das diretrizes buscadas
4. Apresente os achados usando o formato especificado nas diretrizes

Se nenhum arquivo for especificado, pergunte ao usuário quais arquivos revisar.
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
