---
id: intake-conteudo
titulo: Intake Conteudo
descricao: Recebe e estrutura entradas de conteudo para roteamento operacional.
grupo: orquestracao
---

## Objetivo
Padronizar a captura de demandas de conteudo desde a origem.

## Uso
- Aceita entrada por texto colado ou conteudo extraido de PDF.
- Normaliza texto bruto (quebras, espacos, ruido de copia).
- Detecta estrutura inicial: titulo, subtitulos e corpo.
- Registra origem do conteudo (texto manual, PDF, outro documento interno).

## Saida padrao
- resumo-entrada
- origem-conteudo
- estrutura-detectada
- observacoes-de-normalizacao
