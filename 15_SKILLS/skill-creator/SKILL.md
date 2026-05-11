---
name: Criador de Skills
description: Use quando o usuário quiser criar novas skills, modificar ou melhorar skills existentes e medir o desempenho das skills. Também use quando mencionar "criar uma skill", "nova skill", "melhorar skill", "otimizar skill", "testar skill", "avaliar skill", "benchmark de skill" ou "skill não está disparando corretamente". Use mesmo que o usuário diga algo como "transforma esse fluxo em skill" ou "quero capturar isso como skill".
---

# Criador de Skills

Skill para criar novas skills e melhorá-las iterativamente.

O processo de criar uma skill funciona assim:

- Decida o que a skill deve fazer e como ela deve fazer
- Escreva um rascunho da skill
- Crie alguns prompts de teste e execute o Claude-com-acesso-à-skill neles
- Ajude o usuário a avaliar os resultados qualitativa e quantitativamente
- Reescreva a skill com base no feedback da avaliação
- Repita até ficar satisfeito
- Expanda o conjunto de testes e tente novamente em maior escala

Sua função ao usar esta skill é descobrir onde o usuário está nesse processo e ajudá-lo a avançar nessas etapas.

---

## Comunicando com o Usuário

Prestei atenção ao contexto para entender como se comunicar. Em caso de dúvida:

- "avaliação" e "benchmark" são aceitáveis
- para "JSON" e "assertion", verifique se o usuário conhece esses termos antes de usá-los sem explicação
- Está OK explicar brevemente termos se não tiver certeza se o usuário vai entender

---

## Criando uma Skill

### Capturar a Intenção

Comece entendendo a intenção do usuário. A conversa atual pode já conter um fluxo que o usuário quer capturar (ex.: "transforma isso em skill"). Se sim, extraia as respostas do histórico da conversa primeiro — as ferramentas usadas, a sequência de etapas, as correções que o usuário fez, os formatos de entrada/saída observados.

1. O que esta skill deve permitir que o Claude faça?
2. Quando esta skill deve ser acionada? (quais frases/contextos do usuário)
3. Qual é o formato de saída esperado?
4. Devemos criar casos de teste para verificar se a skill funciona?

### Entrevista e Pesquisa

Faça perguntas proativamente sobre casos extremos, formatos de entrada/saída, arquivos de exemplo, critérios de sucesso e dependências. Aguarde para escrever prompts de teste até ter essa parte resolvida.

Verifique MCPs disponíveis — se úteis para pesquisa (buscando documentação, encontrando skills similares, buscando melhores práticas), pesquise em paralelo via subagentes se disponível, caso contrário inline.

### Escrever o SKILL.md

Com base na entrevista com o usuário, preencha esses componentes:

- **name**: Identificador da skill
- **description**: Quando acionar, o que faz. Este é o mecanismo primário de acionamento — inclua tanto o que a skill faz quanto contextos específicos para quando usá-la.
- **compatibility**: Ferramentas necessárias, dependências (opcional, raramente necessário)
- **restante da skill :)**

### Guia de Escrita da Skill

#### Anatomia de uma Skill

```
nome-da-skill/
├── SKILL.md (obrigatório)
│   ├── frontmatter YAML (name, description obrigatórios)
│   └── instruções em Markdown
└── Recursos Agrupados (opcional)
    ├── scripts/    - Código executável para tarefas determinísticas/repetitivas
    ├── references/ - Docs carregados no contexto conforme necessário
    └── assets/     - Arquivos usados na saída (templates, ícones, fontes)
```

#### Divulgação Progressiva

Skills usam um sistema de carregamento de três níveis:
1. **Metadados** (name + description) - Sempre no contexto (~100 palavras)
2. **Corpo do SKILL.md** - No contexto sempre que a skill é acionada (< 500 linhas idealmente)
3. **Recursos agrupados** - Conforme necessário (ilimitado, scripts podem executar sem carregar)

**Padrões principais:**
- Mantenha o SKILL.md abaixo de 500 linhas
- Referencie arquivos claramente a partir do SKILL.md com orientação sobre quando lê-los
- Para arquivos de referência grandes (>300 linhas), inclua um índice

#### Padrões de Escrita

Prefira usar a forma imperativa nas instruções.

**Definindo formatos de saída:**
```markdown
## Estrutura do relatório
USE SEMPRE este modelo exato:
# [Título]
## Resumo executivo
## Principais achados
## Recomendações
```

**Padrão de exemplos:**
```markdown
## Formato de mensagem de commit
**Exemplo 1:**
Entrada: Adicionada autenticação de usuário com tokens JWT
Saída: feat(auth): implementa autenticação baseada em JWT
```

### Estilo de Escrita

Explique ao modelo por que as coisas são importantes em vez de usar instruções rígidas. Use teoria da mente e tente tornar a skill geral, não super estreita a exemplos específicos. Comece escrevendo um rascunho e depois olhe com olhos novos e melhore.

### Casos de Teste

Após escrever o rascunho da skill, elabore 2-3 prompts de teste realistas — o tipo de coisa que um usuário real realmente diria. Compartilhe com o usuário: "Aqui estão alguns casos de teste que gostaria de experimentar. Parecem corretos, ou quer adicionar mais?" Então execute-os.

Salve casos de teste em `evals/evals.json`. Não escreva assertions ainda — apenas os prompts.

```json
{
  "skill_name": "exemplo-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "Prompt da tarefa do usuário",
      "expected_output": "Descrição do resultado esperado",
      "files": []
    }
  ]
}
```

---

## Executando e Avaliando Casos de Teste

Esta seção é uma sequência contínua — não pare no meio. Não use `/skill-test` ou outra skill de teste.

Coloque resultados em `<nome-da-skill>-workspace/` como irmão do diretório da skill.

### Passo 1: Disparar todas as execuções (com-skill E baseline) no mesmo turno

Para cada caso de teste, dispare dois subagentes no mesmo turno — um com a skill, um sem. Isso é importante: não dispare as execuções com-skill primeiro e volte para as baselines depois.

### Passo 2: Enquanto as execuções estiverem em andamento, elabore assertions

Não espere as execuções terminarem — use esse tempo produtivamente. Elabore assertions quantitativas para cada caso de teste e explique-as ao usuário.

### Passo 3: Conforme execuções concluírem, capture dados de tempo

Quando cada tarefa de subagente concluir, salve dados de tempo imediatamente em `timing.json` no diretório da execução.

### Passo 4: Avaliar, agregar e lançar o visualizador

Após todas as execuções terminarem:

1. **Avalie cada execução** — avalie cada assertion contra as saídas
2. **Agregue em benchmark** — execute o script de agregação
3. **Faça uma análise** — leia os dados de benchmark e identifique padrões
4. **Lance o visualizador** com saídas qualitativas e dados quantitativos

---

## Melhorando a Skill

Este é o coração do loop. Você executou os casos de teste, o usuário revisou os resultados, e agora você precisa melhorar a skill com base no feedback.

### Como pensar sobre as melhorias

1. **Generalize a partir do feedback.** O objetivo é criar skills que possam ser usadas muitas vezes em muitos prompts diferentes. Em vez de mudanças superficiais, tente padrões diferentes de trabalho.

2. **Mantenha o prompt enxuto.** Remova coisas que não estão contribuindo. Verifique as transcrições, não apenas as saídas finais.

3. **Explique o porquê.** Tente explicar o **porquê** por trás de tudo que está pedindo ao modelo para fazer.

4. **Procure trabalho repetido entre casos de teste.** Se todos os 3 casos de teste resultaram em o subagente escrevendo scripts auxiliares similares, isso é um sinal forte de que a skill deve incluir esse script.

### O loop de iteração

Após melhorar a skill:

1. Aplique suas melhorias à skill
2. Reexecute todos os casos de teste em um novo diretório `iteration-<N+1>/`
3. Lance o revisor com `--previous-workspace` apontando para a iteração anterior
4. Aguarde o usuário revisar e informar que terminou
5. Leia o novo feedback, melhore novamente, repita

Continue até que:
- O usuário diga que está satisfeito
- O feedback esteja vazio (tudo parece bom)
- Você não está fazendo progresso significativo

---

## Otimização da Descrição

O campo `description` no frontmatter do SKILL.md é o mecanismo primário que determina se o Claude invoca uma skill. Após criar ou melhorar uma skill, ofereça otimizar a descrição para melhor precisão de acionamento.

### Passo 1: Gerar queries de avaliação de acionamento

Crie 20 queries de avaliação — uma mistura de deve-acionar e não-deve-acionar. Salve como JSON:

```json
[
  {"query": "o prompt do usuário", "should_trigger": true},
  {"query": "outro prompt", "should_trigger": false}
]
```

As queries devem ser realistas. Use uma mistura de comprimentos diferentes e foque em casos extremos.

### Passo 2: Revisar com o usuário

Apresente o conjunto de avaliação ao usuário para revisão usando o template HTML.

### Passo 3: Executar o loop de otimização

```bash
python -m scripts.run_loop \
  --eval-set <caminho-para-trigger-eval.json> \
  --skill-path <caminho-para-skill> \
  --model <id-do-modelo-desta-sessão> \
  --max-iterations 5 \
  --verbose
```

### Passo 4: Aplicar o resultado

Pegue `best_description` da saída JSON e atualize o frontmatter do SKILL.md da skill. Mostre ao usuário antes/depois e reporte as pontuações.

---

## Instruções Específicas para Claude.ai

No Claude.ai, o fluxo central é o mesmo (rascunho → teste → revisão → melhoria → repetição), mas como o Claude.ai não tem subagentes, algumas mecânicas mudam:

**Executando casos de teste**: Sem subagentes significa sem execução paralela. Para cada caso de teste, leia o SKILL.md da skill, depois siga suas instruções para realizar o prompt de teste você mesmo.

**Revisando resultados**: Se não conseguir abrir um browser, pule o revisor do browser e apresente os resultados diretamente na conversa.

**Benchmarking**: Pule o benchmarking quantitativo. Foque no feedback qualitativo do usuário.

**Otimização de descrição**: Esta seção requer a ferramenta CLI `claude`. Pule se estiver no Claude.ai.

---

## Arquivos de Referência

O diretório `agents/` contém instruções para subagentes especializados:

- `agents/grader.md` — Como avaliar assertions contra saídas
- `agents/comparator.md` — Como fazer comparação cega A/B entre duas saídas
- `agents/analyzer.md` — Como analisar por que uma versão superou outra

O diretório `references/` tem documentação adicional:
- `references/schemas.md` — Estruturas JSON para evals.json, grading.json, etc.

---

## Loop Central (resumo)

- Descubra do que se trata a skill
- Rascunhe ou edite a skill
- Execute o Claude-com-acesso-à-skill em prompts de teste
- Com o usuário, avalie as saídas
- Repita até que você e o usuário estejam satisfeitos
- Empacote a skill final e devolva ao usuário
