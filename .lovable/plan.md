## Objetivo

Hoje o cadastro de patrimônio só tem dois campos genéricos: "Licença Windows" e "Licença Office". Não dá pra registrar **qual produto exatamente** está instalado (ex.: Office 2021 vs 365 Business, Windows Server 2022 Standard, CAL RDS, Kaspersky). Vamos ampliar para suportar todo o catálogo Delta7.

## Catálogo de produtos a suportar

**Sistemas Operacionais (cliente)**
- Windows 10 Pro / Home
- Windows 11 Pro / Home

**Windows Server**
- Server 2019 Standard / Essentials
- Server 2022 Standard / Essentials
- Server 2025 Standard / Essentials

**Licenças CAL**
- CAL RDS por Dispositivo
- CAL RDS por Usuário

**Microsoft Office (perpétuo)**
- Office 2021
- Office 2024

**Microsoft 365 (assinatura)**
- 365 Business Basic / Standard / Premium
- 365 Personal
- 365 Family

**Antivírus**
- Kaspersky (com variação livre — Standard, Plus, Premium, Endpoint…)

## O que muda na interface (área técnica e admin)

Em vez de dois campos fixos, o formulário passa a ter uma **lista dinâmica de licenças** por máquina. Cada linha contém:

1. **Categoria** (select): Sistema Operacional / Windows Server / CAL RDS / Office / Microsoft 365 / Antivírus / Outro
2. **Produto** (select dependente da categoria) — ex.: ao escolher "Office", aparecem 2021 e 2024
3. **Edição/Variante** (select ou texto, quando se aplica) — ex.: Pro/Home, Standard/Essentials, Business Basic/Standard/Premium
4. **Chave de licença** (texto, com toggle mostrar/ocultar e botão copiar — igual ao atual)
5. **Data de ativação** (date)
6. **Observações da licença** (texto curto, opcional — útil para nº de assento, conta vinculada, expiração)
7. Botão **remover linha** + botão **+ Adicionar licença** no fim da lista

Visualmente, cada licença vira um "chip/card" dentro do formulário e na visualização da máquina (TechAssetViewer), substituindo as duas seções fixas Windows/Office.

## Mudanças no banco

Como a estrutura vira N licenças por máquina, precisamos de uma tabela nova:

```text
asset_licenses
├── id (uuid)
├── asset_id (uuid, FK assets)
├── category (text)        -- 'windows' | 'windows_server' | 'cal_rds' | 'office' | 'm365' | 'antivirus' | 'outro'
├── product (text)         -- 'Windows 11', 'Server 2022', 'Office 2024', '365 Business Standard', 'Kaspersky'…
├── edition (text, null)   -- 'Pro', 'Standard', 'Essentials', 'Por Dispositivo', 'Premium'…
├── license_key (text, null)
├── activation_date (date, null)
├── notes (text, null)
├── created_at / updated_at
```

**RLS** segue o mesmo padrão de `assets` (técnicos aprovados leem/escrevem licenças de patrimônios visíveis a eles; admins gerenciam tudo).

**Compatibilidade com dados existentes**: uma migração popula `asset_licenses` a partir dos campos atuais `windows_license` / `office_license` / `*_activation_date`. Os campos antigos ficam na tabela `assets` por enquanto (deprecated) para não quebrar nada, mas o app passa a ler/gravar só na tabela nova.

## Mudanças nos componentes

- `src/components/tech/TechAssetViewer.tsx` — substitui blocos fixos Windows/Office por lista dinâmica de licenças; formulário usa novo seletor categoria→produto→edição.
- `src/pages/admin/AdminAssets.tsx` — mesmas mudanças de formulário e exibição na tabela (coluna "Licenças" mostrando contagem + tooltip com lista resumida).
- `src/utils/printAssetReport.ts` — relatório PDF passa a listar todas as licenças por máquina (Categoria · Produto · Edição · Ativação · Chave) em vez das colunas fixas.
- Novo arquivo `src/lib/licenseCatalog.ts` — fonte única do catálogo (categorias, produtos, edições) para alimentar os selects.

## Resumo do fluxo final

1. Técnico abre "Novo Patrimônio" → preenche máquina/empresa → clica em **+ Adicionar licença**.
2. Escolhe Categoria (ex.: Microsoft 365) → Produto (365 Business) → Edição (Standard) → cola a chave → data de ativação.
3. Pode adicionar quantas licenças quiser (ex.: Windows 11 Pro + Office 2024 + Kaspersky na mesma máquina).
4. Visualização e relatório imprimem todas as licenças agrupadas por máquina.

Posso seguir com a implementação?
