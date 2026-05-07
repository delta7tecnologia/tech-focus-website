## Proposta Comercial — Suporte de TI Mensal

Criar um módulo novo, paralelo ao de Backup Online, focado no carro-chefe da Delta7: contrato mensal de suporte de TI para estações e servidores. Mesma facilidade de uso (formulário rápido, 2 modelos de PDF, assinatura digital, hash de integridade, logo Altatek opcional, presets enxuto/padrão).

### 1. Banco de dados

Nova tabela `it_support_proposals` (separada de `commercial_proposals` para não acoplar os fluxos), com a mesma espinha dorsal:

- Identificação: `proposal_number` (`SUP-YYYY-NNNN`), `proposal_seq`, `created_by`, `generated_at`, `validity_days` (padrão 15).
- Cliente: `client_name`, `client_document`, `client_contact`, `client_email`, `client_address`.
- Comercial: `sales_rep_name`, `sales_rep_email`, `items` (jsonb), `discount`, `monthly_total`, `setup_fee` (ativação opcional), `contract_months` (padrão 12).
- Conteúdo: `notes`, `sections` (jsonb com toggles), `show_altatek_logo`, `pdf_template` ('modelo01' | 'modelo02').
- Integridade: `is_draft`, `locked`, `integrity_hash`, `audit_log`.

Tabela auxiliar `it_support_proposal_signature_links` (espelho de `proposal_signature_links`) para o fluxo público de assinatura em `/assinar-suporte/:token`.

Triggers e RLS idênticos aos da proposta de backup (numeração automática, lock ao finalizar, registro em audit_log, políticas para técnicos aprovados/admins, leitura pública por hash).

### 2. Catálogo padrão (editável no formulário)

Itens pré-cadastrados em `src/lib/itSupportContent.ts`:

```text
- Suporte por estação Windows/Mac     R$  80,00 / mês
- Suporte por servidor Windows         R$ 250,00 / mês
- Suporte por servidor Linux           R$ 200,00 / mês
- Suporte a Hyper-V/VMware             R$ 180,00 / mês
- Monitoramento Zabbix/Grafana         R$ 120,00 / mês
- Gestão de antivírus corporativo      R$  15,00 / estação
- Gestão de firewall/UTM               R$ 200,00 / mês
- Gestão de Active Directory           R$ 250,00 / mês
- Hora técnica avulsa (fora do escopo) R$ 180,00 / hora
- Visita presencial em Parauapebas     R$ 150,00 / visita
```

### 3. Conteúdo fixo do PDF

Mesma estrutura do backup, adaptada:

- **Sobre a Delta7 + KPIs** (+10 anos, 99,9%, 24/7).
- **Por que terceirizar TI** (8 cards: redução de custo, time especializado, foco no negócio, SLA, monitoramento 24/7, prevenção, conformidade LGPD, suporte humano).
- **Escopo incluso** (suporte remoto seg-sex 8h-18h, plantão sáb 8h-12h, monitoramento, gestão de patches, antivírus, backup local, orientação a usuários, abertura de chamado WhatsApp/telefone, painel online).
- **Não inclusos** (hardware, licenças, cabeamento, plantão 24h, deslocamento fora de Parauapebas, projetos sob demanda — cobrados como hora técnica).
- **SLA por prioridade** (Crítico 1h / Alto 4h / Médio 8h / Baixo 24h úteis).
- **Perfil ideal** (empresa com 5+ estações, dependência de TI para operar, sem equipe interna, precisa de conformidade).
- **Citação institucional** + **Aceite + QR** (fixos).

Cada bloco vira toggle no formulário (presets: Enxuta / Padrão / Apenas comercial).

### 4. Frontend

```text
src/
├── components/tech/it-support/
│   ├── ItSupportProposals.tsx          (lista + ações, espelho de CommercialProposals)
│   ├── ItSupportProposalForm.tsx       (formulário com catálogo, toggles, modelos)
│   ├── ItSupportItemsEditor.tsx
│   └── ItSupportSignatureLinksManager.tsx
├── pages/
│   ├── admin/AdminItSupportProposals.tsx
│   ├── SignItSupportProposal.tsx
│   └── ValidateItSupportProposal.tsx
├── lib/itSupportContent.ts             (catálogo, textos fixos, toggles)
└── utils/itSupportProposalPdf.ts       (Modelo 01 premium + Modelo 02 editorial)
```

PDF reutiliza os helpers visuais do `commercialProposalPdf.ts` (paleta, header, capa, bloco de assinatura, QR, hash, logo Altatek opcional só na capa do Modelo 01) — copiados/adaptados para evitar acoplamento.

### 5. Navegação no Admin

Nova rota `/admin/propostas-suporte` adicionada em `App.tsx` e item "Propostas Suporte TI" no menu lateral, ao lado de "Propostas Comerciais" (que será renomeada visualmente para "Propostas Backup" no label do menu).

### 6. Fluxos públicos

- `/assinar-suporte/:token` — espelho de `SignProposal.tsx`.
- `/validar-suporte/:hash` — espelho de `ValidateProposal.tsx`, baixa o PDF original.

### 7. Decisões assumidas (você não respondeu, segui o mais coerente)

1. **Módulo separado** com tabela própria — mantém isolamento e permite evoluir cada produto sem regressões.
2. **Catálogo padrão** acima — preços alinhados ao mercado MSP regional, todos editáveis no formulário antes de salvar.
3. **Escopo incluso/não incluso** redigido como texto fixo (você poderá ajustar depois em `itSupportContent.ts`).
4. **Toggles do PDF** incluem: Sobre+KPIs, Cards de benefícios, Escopo detalhado, SLA, Perfil ideal, Citação. Sem stack de monitoramento separado (entra no escopo).

Se quiser ajustar catálogo de preços, textos do escopo ou SLAs antes de eu construir, me diga agora — caso contrário, posso implementar com esses defaults.