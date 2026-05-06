## Controle de seções da proposta (versão enxuta x completa)

Adicionar checkboxes no formulário para incluir/excluir blocos opcionais do PDF. Quanto menos seções marcadas, mais curto o documento. Padrão: tudo ligado (igual ao atual).

### Seções opcionais (cada uma vira um toggle)

| Seção | Páginas que costuma ocupar |
|---|---|
| Sobre a Delta7 + KPIs | ~½ página |
| Cards "Por que Backup Online" (8 cards) | ~½ página |
| Cards "Onde seus dados ficam" (4 infra) | ~⅓ página |
| Numerais "Esta solução é ideal se..." | ~⅓ página |
| Citação institucional | ~⅙ página |
| Requisitos de suporte (lista de bullets) | ~½ página |

Sempre fixos (não podem ser desativados): Capa, Identificação do Cliente, Executivo, Configuração inicial, Cenário mensal, Não inclusos, Suporte (texto base) e Aceite + QR.

### Modo rápido — presets

Acima dos toggles, três botões: **Enxuta** (só fixos + KPIs), **Padrão** (tudo) e **Apenas comercial** (só fixos + cenário). Clicando, marca os checkboxes correspondentes.

### Mudanças técnicas

1. **`src/lib/proposalContent.ts`** — exportar `ProposalSections` type com flags `showAbout`, `showBenefits`, `showInfra`, `showIdealFor`, `showQuote`, `showSupportReqs` e helper `DEFAULT_SECTIONS`/`COMPACT_SECTIONS`/`MINIMAL_SECTIONS`.
2. **DB migration** — adicionar coluna `sections jsonb` (nullable) em `commercial_proposals` para persistir a escolha por proposta.
3. **`ProposalForm.tsx`** — novo card "Conteúdo do PDF" com 6 checkboxes + 3 botões de preset; estado `sections`; salvar no payload.
4. **`commercialProposalPdf.ts`** — `CommercialProposalPdfData` aceita `sections?: ProposalSections`. Cada bloco renderizado condicionalmente. Default = todas true (compatível com propostas antigas).
5. **`ValidateProposal.tsx` + lista** — passar `sections` ao baixar PDF.

### Fluxo do usuário

```text
Formulário da proposta
  └── Card "Conteúdo do PDF"
       ├── [Enxuta] [Padrão] [Apenas comercial]   ← presets
       ├── ☑ Sobre a Delta7 + KPIs
       ├── ☑ Cards de benefícios (8)
       ├── ☑ Cards de infraestrutura (4)
       ├── ☑ Perfil ideal (4 numerais)
       ├── ☑ Citação institucional
       └── ☑ Requisitos de suporte
```

Resultado: o usuário consegue gerar um PDF de 2 páginas (preset Apenas comercial) até as 4–5 páginas atuais (Padrão), sem mexer em código.
