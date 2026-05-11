---
<<<<<<< HEAD
name: webapp-testing
description: Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs.
license: Complete terms in LICENSE.txt
---

# Web Application Testing

To test local web applications, write native Python Playwright scripts.

**Helper Scripts Available**:
- `scripts/with_server.py` - Manages server lifecycle (supports multiple servers)

**Always run scripts with `--help` first** to see usage. DO NOT read the source until you try running the script first and find that a customized solution is abslutely necessary. These scripts can be very large and thus pollute your context window. They exist to be called directly as black-box scripts rather than ingested into your context window.

## Decision Tree: Choosing Your Approach

```
User task → Is it static HTML?
    ├─ Yes → Read HTML file directly to identify selectors
    │         ├─ Success → Write Playwright script using selectors
    │         └─ Fails/Incomplete → Treat as dynamic (below)
    │
    └─ No (dynamic webapp) → Is the server already running?
        ├─ No → Run: python scripts/with_server.py --help
        │        Then use the helper + write simplified Playwright script
        │
        └─ Yes → Reconnaissance-then-action:
            1. Navigate and wait for networkidle
            2. Take screenshot or inspect DOM
            3. Identify selectors from rendered state
            4. Execute actions with discovered selectors
```

## Example: Using with_server.py

To start a server, run `--help` first, then use the helper:

**Single server:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python your_automation.py
```

**Multiple servers (e.g., backend + frontend):**
=======
name: Teste de Aplicação Web
description: Kit de ferramentas para interagir e testar aplicações web locais usando Playwright. Use quando precisar verificar funcionalidade de frontend, depurar comportamento de UI, capturar screenshots do browser ou visualizar logs do browser.
license: Termos completos em LICENSE.txt
---

# Teste de Aplicação Web

Para testar aplicações web locais, escreva scripts Python nativos com Playwright.

**Scripts Auxiliares Disponíveis**:
- `scripts/with_server.py` - Gerencia o ciclo de vida do servidor (suporta múltiplos servidores)

**Sempre execute os scripts com `--help` primeiro** para ver o uso. NÃO leia o código-fonte até executar o script e constatar que uma solução personalizada é absolutamente necessária. Esses scripts podem ser muito grandes e poluir a janela de contexto. Eles existem para ser chamados diretamente como scripts de caixa-preta, não para serem ingeridos no contexto.

## Árvore de Decisão: Escolhendo a Abordagem

```
Tarefa do usuário → É HTML estático?
    ├─ Sim → Leia o arquivo HTML diretamente para identificar seletores
    │         ├─ Sucesso → Escreva script Playwright usando os seletores
    │         └─ Falha/Incompleto → Trate como dinâmico (abaixo)
    │
    └─ Não (webapp dinâmico) → O servidor já está rodando?
        ├─ Não → Execute: python scripts/with_server.py --help
        │        Depois use o helper + escreva script Playwright simplificado
        │
        └─ Sim → Reconhecimento-antes-da-ação:
            1. Navegue e aguarde networkidle
            2. Capture screenshot ou inspecione o DOM
            3. Identifique seletores do estado renderizado
            4. Execute ações com os seletores descobertos
```

## Exemplo: Usando with_server.py

Para iniciar um servidor, execute `--help` primeiro, depois use o helper:

**Servidor único:**
```bash
python scripts/with_server.py --server "npm run dev" --port 5173 -- python sua_automação.py
```

**Múltiplos servidores (ex.: backend + frontend):**
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
<<<<<<< HEAD
  -- python your_automation.py
```

To create an automation script, include only Playwright logic (servers are managed automatically):
=======
  -- python sua_automação.py
```

Ao criar um script de automação, inclua apenas a lógica do Playwright (servidores são gerenciados automaticamente):
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
<<<<<<< HEAD
    browser = p.chromium.launch(headless=True) # Always launch chromium in headless mode
    page = browser.new_page()
    page.goto('http://localhost:5173') # Server already running and ready
    page.wait_for_load_state('networkidle') # CRITICAL: Wait for JS to execute
    # ... your automation logic
    browser.close()
```

## Reconnaissance-Then-Action Pattern

1. **Inspect rendered DOM**:
   ```python
   page.screenshot(path='/tmp/inspect.png', full_page=True)
=======
    browser = p.chromium.launch(headless=True)  # Sempre inicie chromium em modo headless
    page = browser.new_page()
    page.goto('http://localhost:5173')  # Servidor já rodando e pronto
    page.wait_for_load_state('networkidle')  # CRÍTICO: Aguarde o JS executar
    # ... sua lógica de automação
    browser.close()
```

## Padrão Reconhecimento-Antes-da-Ação

1. **Inspecione o DOM renderizado**:
   ```python
   page.screenshot(path='/tmp/inspecao.png', full_page=True)
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
   content = page.content()
   page.locator('button').all()
   ```

<<<<<<< HEAD
2. **Identify selectors** from inspection results

3. **Execute actions** using discovered selectors

## Common Pitfall

❌ **Don't** inspect the DOM before waiting for `networkidle` on dynamic apps
✅ **Do** wait for `page.wait_for_load_state('networkidle')` before inspection

## Best Practices

- **Use bundled scripts as black boxes** - To accomplish a task, consider whether one of the scripts available in `scripts/` can help. These scripts handle common, complex workflows reliably without cluttering the context window. Use `--help` to see usage, then invoke directly. 
- Use `sync_playwright()` for synchronous scripts
- Always close the browser when done
- Use descriptive selectors: `text=`, `role=`, CSS selectors, or IDs
- Add appropriate waits: `page.wait_for_selector()` or `page.wait_for_timeout()`

## Reference Files

- **examples/** - Examples showing common patterns:
  - `element_discovery.py` - Discovering buttons, links, and inputs on a page
  - `static_html_automation.py` - Using file:// URLs for local HTML
  - `console_logging.py` - Capturing console logs during automation
=======
2. **Identifique seletores** a partir dos resultados da inspeção

3. **Execute ações** usando os seletores descobertos

## Armadilha Comum

❌ **Não** inspecione o DOM antes de aguardar `networkidle` em apps dinâmicos
✅ **Faça** aguardar `page.wait_for_load_state('networkidle')` antes da inspeção

## Melhores Práticas

- **Use os scripts como caixas-pretas** — Para realizar uma tarefa, verifique se algum script em `scripts/` pode ajudar. Esses scripts lidam com workflows comuns e complexos de forma confiável sem poluir o contexto. Use `--help` para ver o uso, depois invoque diretamente.
- Use `sync_playwright()` para scripts síncronos
- Sempre feche o browser ao terminar
- Use seletores descritivos: `text=`, `role=`, seletores CSS ou IDs
- Adicione esperas apropriadas: `page.wait_for_selector()` ou `page.wait_for_timeout()`

## Arquivos de Referência

- **examples/** - Exemplos mostrando padrões comuns:
  - `element_discovery.py` - Descobrindo botões, links e inputs em uma página
  - `static_html_automation.py` - Usando URLs file:// para HTML local
  - `console_logging.py` - Capturando logs do console durante automação
>>>>>>> 5d4c11afd9ddab5a1c724f68943bff995dae610e
