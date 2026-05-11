---
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
```bash
python scripts/with_server.py \
  --server "cd backend && python server.py" --port 3000 \
  --server "cd frontend && npm run dev" --port 5173 \
  -- python sua_automação.py
```

Ao criar um script de automação, inclua apenas a lógica do Playwright (servidores são gerenciados automaticamente):
```python
from playwright.sync_api import sync_playwright

with sync_playwright() as p:
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
   content = page.content()
   page.locator('button').all()
   ```

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
