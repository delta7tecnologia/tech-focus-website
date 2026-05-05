## Objetivo

Criar uma ferramenta interna para gerar **Propostas Comerciais de Backup Online em PDF**, eliminando a edição manual no Word. Dados institucionais da Delta7 e textos fixos ficam no código; o usuário só preenche cliente, executivo e quantidades.

## Decisões confirmadas
- Preços padrão exatamente como no modelo PDF
- Executivo de vendas editável (preenchido com dados do perfil logado)
- Página pública de validação por QR Code (mesmo padrão das OS)

## Estrutura do PDF (baseado no modelo)

1. **Capa** — Logo Delta7 (branca sobre fundo azul `#1e3a8a`) + "BACKUP ONLINE — Sua empresa protegida de verdade" + bloco "Sobre a Delta7".
2. **Benefícios** — Lista fixa: multiplataforma (Windows/Linux/MacOS), nuvem, dispensa hardware local, anti-ransomware, automatização, retenção, gerenciamento centralizado, notificações.
3. **Proposta Comercial** — Cliente, executivo de vendas, e-mail e linha "Ativação do Serviço — R$ 90,00".
4. **Cenário com Backup Online** — Tabela editável (Qtd × Unitário = Subtotal) + **Custo Mensal Total** + bloco "Não inclusos".
5. **Suporte Técnico** — Texto fixo (corrigido para Delta7, removendo "Set Telecom"): SLA seg-sex 8h–18h, plantão sáb 8h–12h, contato via WhatsApp, contrato 12 meses, hora extra fora do horário R$ 200,00.
6. **Assinatura + Validação** — Linhas Cliente/Delta7, data, número da proposta `PROP-AAAA-NNNN`, hash SHA-256 e QR para `/validar-proposta/:hash`.

## Catálogo padrão (preços fixos do PDF)

| Item | Valor unit. mensal |
|---|---|
| Computador desktop | R$ 38,00 |
| Servidor Windows Server | R$ 90,00 |
| Servidor Linux | R$ 90,00 |
| Servidor Hyper-V | R$ 270,00 |
| MS SQL Server | R$ 130,00 |
| 1 TB de armazenamento | R$ 90,00 |
| Ativação do Serviço (única) | R$ 90,00 |

Botão "Adicionar item personalizado" para casos fora do catálogo.

## Backend (Lovable Cloud)

Tabela nova `commercial_proposals`:
- Identificação: `id`, `proposal_number`, `proposal_seq` (sequence), `created_by`, `created_at`, `updated_at`, `generated_at`
- Cliente: `client_name`, `client_document`, `client_contact`, `client_email`, `client_address`
- Comercial: `sales_rep_name`, `sales_rep_email`, `validity_days` (default 15), `notes`
- Itens: `items` jsonb `[{description, qty, unit_price}]`, `activation_fee` (default 90), `discount`
- Totais calculados na geração: `monthly_total`, `setup_total`
- Estado: `status` ('rascunho'|'enviada'|'aceita'|'recusada'), `is_draft`, `locked`, `integrity_hash`, `audit_log` jsonb

Sequence `commercial_proposals_seq` + triggers (mesmo padrão das OS):
- `proposals_set_seq`, `proposals_lock_on_finalize`, `update_updated_at_column`

RLS:
- Admin: ALL
- Técnicos aprovados: SELECT/INSERT/UPDATE/DELETE próprios
- Público: SELECT por `integrity_hash IS NOT NULL` (validação via QR)

## Frontend

**Arquivos novos:**
```text
src/components/tech/proposals/
  ├── CommercialProposals.tsx      # shell + lista
  ├── ProposalList.tsx             # filtros + ações (PDF, duplicar, excluir)
  ├── ProposalForm.tsx             # formulário em seções
  └── ProposalItemsEditor.tsx      # tabela de itens com presets
src/pages/admin/AdminProposals.tsx  # entrada no admin
src/pages/ValidateProposal.tsx      # validação pública por hash
src/utils/commercialProposalPdf.ts  # gerador HTML→PDF
src/lib/proposalContent.ts          # textos fixos + catálogo
supabase/migrations/<ts>_commercial_proposals.sql
```

**Formulário:**
- Cliente: campo de busca por CNPJ/CPF reutilizando lookup do `ReportClientInfoDialog` + validação via `@/lib/validators/document`
- Executivo: nome + e-mail (pré-preenchidos do perfil, editáveis)
- Itens: catálogo com checkboxes/qtd + linhas customizadas
- Recálculo automático do total mensal
- Ações: Salvar rascunho / Finalizar e gerar PDF

**Geração de PDF** (`commercialProposalPdf.ts`):
- Mesmo padrão de `serviceOrderPdf.ts` (`html2canvas` + `jsPDF`)
- Logo branca em capa azul (`DELTA7_LOGO_DATA_URL`), logo escura em páginas internas (`DELTA7_LOGO_DARK_DATA_URL`)
- Paleta corporativa azul/cinza, Helvetica
- QR Code via `qrcode` apontando para `/validar-proposta/:hash`
- Hash SHA-256 com `reportHash.ts`

**Roteamento:**
- `App.tsx`: rotas `/validar-proposta/:hash` e admin
- `AdminLayout`: novo item "Propostas"
- `AreaTecnica`: novo card "Propostas Comerciais"

## Segurança
- Validação CNPJ/CPF cliente-side (zod já em uso) + máscara
- RLS completo, hash de integridade, validação pública somente leitura
- Trigger de auditoria registra finalização e edições pós-emissão
