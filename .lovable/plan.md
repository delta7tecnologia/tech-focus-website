
# Implementação completa das melhorias de Ordem de Serviço

Vou implementar todos os 10 itens em uma única entrega, organizados por área técnica.

## 1. Banco de dados (migration)

- Adicionar coluna `os_seq bigserial` em `service_orders` para numeração sequencial (`OS-2026-000123`)
- Adicionar coluna `audit_log jsonb default '[]'` para log de reaberturas/edições pós-emissão
- Adicionar coluna `locked boolean default false` (true após emissão; só admin pode destravar)
- Nova RLS pública por `integrity_hash` (anon SELECT quando hash não-nulo) — espelho de `technical_reports`
- Ajustar RLS de UPDATE: bloquear edição quando `locked=true` exceto admin
- Trigger `service_orders_set_seq` para preencher `os_seq` antes do insert
- Trigger `service_orders_lock_on_finalize` que seta `locked=true` quando `is_draft` muda para false e injeta entrada no `audit_log`

## 2. Página pública de validação por QR Code

- Nova rota `/validar-os/:hash` em `App.tsx`
- Nova página `src/pages/ValidateServiceOrder.tsx`:
  - Busca por hash exato e fallback para hash parcial (≥16 chars)
  - Mostra: nº OS, cliente, técnico, datas, check-in/out (com link Maps), status, resumo, assinaturas (presencial + remotas), hash, audit log
  - Botão "Baixar PDF original" reusando `downloadServiceOrderPdf`
  - Aviso destacado se houver entradas no `audit_log` (documento foi reaberto/editado após emissão)

## 3. PDF aprimorado (`serviceOrderPdf.ts`)

- Gerar QR Code com lib `qrcode` (já instalada) apontando para `/validar-os/{hash}`
- Inserir QR + hash + assinaturas dentro de `<div id="so-footer-block">` com lógica anti-quebra de página (idêntica ao `reportPdfAdvanced.ts`)
- Renderizar evidências em chunks (máx 6 por "página lógica") com `page-break-before` entre elas
- Substituir link de Maps por QR Code menor que aponta para o Maps do check-in

## 4. Validação visual antes de finalizar (`ServiceOrderForm.tsx`)

- Bloco "Checklist para finalizar" sempre visível com ícones ✅/⬜:
  - Cliente, Endereço, Resumo, ≥1 evidência, Check-in registrado, Assinatura (presencial OU link remoto assinado)
- Botão "Finalizar OS" mostra tooltip com itens pendentes quando desabilitado
- Ao clicar em Finalizar sem check-out, captura check-out automaticamente

## 5. UX em campo (mobile-first)

- Wizard de 5 etapas com tabs: Identificação → Visita (check-in/out) → Atendimento → Evidências → Assinatura
- Botões grandes "🟢 Iniciar visita" / "🔴 Encerrar visita" no topo de cada etapa
- **Auto-save** a cada 30s do rascunho via `useEffect` + debounce
- `<input multiple>` para enviar várias fotos de uma vez
- Compressão client-side (canvas → JPEG 0.85, max 1600px) antes do upload — utilitário novo `src/utils/compressImage.ts`

## 6. Numeração sequencial

- Função client `nextOsNumber()` removida; o backend gera via trigger usando `os_seq`
- Form mostra `OS-AAAA-NNNNNN` baseado na sequência (após primeiro save)
- Compatibilidade: OS antigas mantêm seu `os_number` original

## 7. Anexos além de fotos

- Input aceita `image/*,application/pdf,video/mp4` até 20MB
- Estrutura `evidences` ganha `kind: 'image' | 'file' | 'video'`
- Thumbnail genérica para PDFs/vídeos com nome do arquivo
- No PDF: anexos não-imagem aparecem como "📎 [nome] — link assinado de 7 dias"

## 8. Notificações por e-mail

- Botão "Enviar por e-mail" no `SOSignatureLinksManager` (quando `signer_email` preenchido)
- Nova edge function `send-os-signature-link/index.ts` (template pt-BR, usa `notify.delta7tecnologia.com.br`)
- Trigger pós-assinatura: edge function `notify-os-signed` envia e-mail ao técnico criador com link do PDF
- Validação CORS, JWT em código, rate limit simples por IP

## 9. Filtros e métricas no Admin

- `AdminServiceOrders.tsx` ganha:
  - 4 cards no topo: OS em aberto, Emitidas no mês, KM total, Tempo médio (h)
  - Filtros: técnico (select), período (date range), status, tipo de visita
  - Botão "Exportar CSV" (gera no client com `papaparse` ou string manual)

## 10. Correções de lógica

- `signed_at` setado **apenas uma vez** na primeira assinatura (verificar `draft?.signed_at`)
- Status `concluido` mantido quando re-salvando OS já finalizada (não voltar para `em_andamento`)
- `SignServiceOrder.tsx` ganha QR Code do hash logo abaixo do "Documento autêntico"
- Evidence cleanup ao deletar OS (já existe, validar)

---

## Estrutura de arquivos

**Novos:**
- `src/pages/ValidateServiceOrder.tsx`
- `src/utils/compressImage.ts`
- `src/components/tech/service-orders/ServiceOrderWizard.tsx` (wrapper de etapas)
- `src/components/tech/service-orders/ServiceOrderFinalizeChecklist.tsx`
- `src/components/admin/ServiceOrdersMetrics.tsx`
- `supabase/functions/send-os-signature-link/index.ts`
- `supabase/functions/notify-os-signed/index.ts`
- `supabase/migrations/<timestamp>_so_improvements.sql`

**Editados:**
- `src/App.tsx` — nova rota `/validar-os/:hash`
- `src/components/tech/service-orders/ServiceOrderForm.tsx` — wizard, auto-save, compressão, validação
- `src/components/tech/service-orders/ServiceOrderList.tsx` — multi-anexo
- `src/components/tech/service-orders/SOSignatureLinksManager.tsx` — botão envio e-mail
- `src/pages/SignServiceOrder.tsx` — QR Code do hash
- `src/pages/admin/AdminServiceOrders.tsx` — métricas e filtros
- `src/utils/serviceOrderPdf.ts` — QR Code, anti-quebra, anexos, chunks de evidências

---

## Confirmação

Vou executar tudo numa única passada. A migration vai pedir sua aprovação automaticamente quando rodar (esse é o fluxo padrão da Lovable Cloud). Pode aprovar para eu seguir.
