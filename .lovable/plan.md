# Gerador de Laudos Técnicos Padronizados

Nova funcionalidade dentro da **Área Técnica** (`/area-tecnica`) para que técnicos aprovados gerem laudos profissionais timbrados Delta7, com checklist guiado, anexos fotográficos com legenda, hash de integridade SHA-256 e exportação em PDF formato A4.

## Onde fica

Adicionar uma terceira aba em `TechFileManager.tsx` ao lado de "Arquivos" e "Patrimônios":

```text
[ Arquivos ]  [ Patrimônios ]  [ Laudos Técnicos ]
```

Acesso restrito aos mesmos critérios já existentes (técnico aprovado ou admin).

## Tela do Gerador (formulário guiado)

Layout em cards numerados, mobile-first, paleta azul-marinho/cinza/branco já usada no projeto.

**1. Identificação**
- Empresa cliente (autocomplete reaproveitando `companies` de `assets`, com opção de digitar nova — mesmo padrão já implementado no Patrimônio)
- Equipamento / nº de série / modelo
- Técnico responsável (preenchido automaticamente com `profile.full_name`, editável)
- Data/hora capturada automaticamente (somente leitura, exibida no topo)

**2. Triagem**
- Estado geral do equipamento — RadioGroup: Bom / Regular / Crítico
- Lacre violado? — RadioGroup: Sim / Não
- Acessórios recebidos (texto curto opcional)

**3. Diagnóstico**
- Testes realizados (Textarea)
- Causa raiz identificada (Textarea)
- Peças/componentes necessários (Textarea)

**4. Conclusão**
- Recomendações ao cliente (Textarea)
- Status final — Select: Resolvido / Pendente / Condenado

**5. Anexos fotográficos**
- Botão "Adicionar fotos" (`<input type="file" accept="image/*" capture="environment" multiple>` — abre câmera no celular)
- Grid de previews; cada foto tem campo de legenda inline e botão remover
- Sem limite rígido, validação de tamanho (≤ 5 MB por foto)

**6. Ações**
- "Gerar Laudo Final" (gera PDF + salva no histórico)
- "Limpar formulário"

## Geração do PDF (A4)

Usar **jsPDF + html2canvas** (já sugeridos pelo usuário). Renderizar um template HTML oculto estilizado e converter em PDF multi-página A4.

Estrutura do laudo:

```text
┌─────────────────────────────────────────┐
│  DELTA7 SOLUÇÕES EM TECNOLOGIA          │ ← cabeçalho timbrado
│  Laudo Técnico Nº LDO-AAAAMMDD-XXXX     │   azul-marinho
├─────────────────────────────────────────┤
│  Data/Hora: 25/04/2026 14:32            │
│  Técnico:   João Silva                  │
│  Cliente:   Empresa XYZ                 │
│  Equipamento: Notebook Dell ...         │
├─────────────────────────────────────────┤
│  1. TRIAGEM                             │
│  Constatou-se que o equipamento ...     │ ← texto narrativo
│                                         │
│  2. DIAGNÓSTICO                         │
│  Foram realizados os seguintes ...      │
│                                         │
│  3. CONCLUSÃO                           │
│  Status final: RESOLVIDO                │
│                                         │
│  4. EVIDÊNCIAS FOTOGRÁFICAS             │
│  [foto]  [foto]                         │
│  Legenda     Legenda                    │
├─────────────────────────────────────────┤
│  Hash SHA-256: a3f2b9c8d4e5...          │
│  Este documento possui integridade      │
│  garantida pela hash de segurança       │
│  da plataforma Delta7                   │
└─────────────────────────────────────────┘
```

**Transformação de respostas curtas em narrativa** (helper `narrate()`):
- Estado "Crítico" → "Constatou-se que o equipamento foi recebido em estado crítico, apresentando sinais evidentes de comprometimento."
- Lacre "Sim" → "Constatou-se a violação do selo de garantia original, o que pode implicar perda da cobertura do fabricante."
- Lacre "Não" → "Os selos de garantia originais encontram-se íntegros."
- Status "Condenado" → "Após análise técnica detalhada, o equipamento foi considerado **CONDENADO** ..."

## Hash de integridade SHA-256

Usando a Web Crypto API nativa (sem libs):

```text
hash = SHA-256( JSON.stringify(form) + tecnico + ISOTimestamp )
```

- Gerado no momento do "Gerar Laudo Final"
- Exibido no rodapé do PDF e salvo junto ao registro no banco
- Permite verificação futura de adulteração

## Persistência (Lovable Cloud)

Nova tabela **`technical_reports`**:

| coluna | tipo | nota |
|---|---|---|
| id | uuid PK | |
| report_number | text | LDO-AAAAMMDD-XXXX (sequencial) |
| created_by | uuid | técnico autor |
| technician_name | text | snapshot do nome |
| company_name | text | |
| equipment | text | |
| triagem | jsonb | estado, lacre, acessórios |
| diagnostico | jsonb | testes, causa, peças |
| conclusao | jsonb | recomendações, status |
| photos | jsonb | `[{path, caption}]` |
| integrity_hash | text | SHA-256 |
| generated_at | timestamptz | |
| created_at / updated_at | timestamptz | |

**RLS** (mesmo padrão de `assets`):
- SELECT: técnicos aprovados + admins
- INSERT: técnicos aprovados (created_by = auth.uid())
- UPDATE/DELETE: dono ou admin

**Storage**: novo bucket privado **`report-photos`** com policies espelhando `asset-screenshots` (ownership-based update/delete, leitura por aprovados via signed URL de 1h).

## Histórico de laudos

Dentro da aba "Laudos Técnicos", abaixo do botão "Novo Laudo", lista dos laudos do técnico (admins veem todos):

- Nº do laudo, cliente, equipamento, data, status (badge colorido)
- Ações: **Ver** (re-gera o PDF a partir dos dados salvos), **Excluir**
- Campo de busca por cliente/nº

## Detalhes técnicos

- Bibliotecas a instalar: `jspdf`, `html2canvas`
- Hash: `crypto.subtle.digest('SHA-256', ...)` (nativo do browser, zero dependência)
- Numeração: `LDO-{yyyymmdd}-{4 chars random}` gerada client-side, com unique constraint na coluna
- PDF multi-página: html2canvas → split em páginas A4 (210×297mm) via jsPDF `addImage` + `addPage`
- Upload das fotos: paralelo via `Promise.all`, paths salvos no jsonb
- Mobile: input com `capture="environment"` aciona câmera traseira; previews em grid 2 colunas
- O laudo no PDF embute as imagens como base64 (já carregadas no preview), garantindo render correto

## Arquivos afetados

**Novos**
- `src/components/tech/reports/ReportGenerator.tsx` — formulário guiado
- `src/components/tech/reports/ReportList.tsx` — histórico
- `src/components/tech/reports/TechReports.tsx` — wrapper da aba
- `src/utils/reportPdf.ts` — montagem HTML + jsPDF
- `src/utils/reportHash.ts` — SHA-256 helper
- `src/utils/reportNarrative.ts` — `narrate()` helpers
- `supabase/migrations/<timestamp>_create_technical_reports.sql` — tabela, RLS, bucket, policies

**Editados**
- `src/components/tech/TechFileManager.tsx` — adiciona terceira aba "Laudos Técnicos"
- `package.json` — adiciona `jspdf` e `html2canvas`

## Fora do escopo (podem virar v2)
- Assinatura digital do cliente (canvas)
- Verificação pública de hash via QR Code no PDF
- Envio automático do laudo por e-mail ao cliente
