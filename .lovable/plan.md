# Proposta Backup Online — Redesign Premium "Navy & Gold"

Reformular o PDF de proposta com identidade editorial premium, paleta navy + dourado, tipografia robusta e elementos decorativos (números massivos, citações com aspa gigante, ícones SVG circulares com toque dourado, faixa de KPIs).

## Paleta (fixa no PDF)

```text
navy        #0a1f44   fundos escuros, títulos
navyDeep    #142a5c   gradiente da capa
gold        #c9a84c   acentos, números, filetes
goldLight   #e6c875   highlights de citação
cream       #f5f0e0   fundos sutis
ink         #1a2540   texto principal
muted       #5b6478   textos secundários
paper       #fbfaf6   fundo de cards
```

## Conteúdo novo (`src/lib/proposalContent.ts`)

Adicionar constantes: `PROP_COLORS`, `DELTA7_KPIS` (4 cards), `TECH_STACK` (8 nomes), `INFRA_HIGHLIGHTS` (4 itens c/ ícone), `BENEFIT_CARDS` (8 cards substituindo a lista de bullets), `IDEAL_FOR` (4 perfis), `INSTITUTIONAL_QUOTE`.

## Redesign do PDF (`src/utils/commercialProposalPdf.ts`)

### Capa (mais polish, mantendo estrutura)
- Gradiente diagonal `navy → navyDeep`
- Padrão sutil de pontos dourados no fundo (SVG inline 5% opacidade)
- Filete dourado horizontal acima do título
- "BACKUP" branco + "ONLINE" em **dourado** (não mais azul claro)
- Logo Delta7 no topo, informações do cliente no rodapé com filete dourado

### Páginas internas — fluxo
```text
Header com logo + nº proposta + filete dourado fino
SOBRE A DELTA7 — texto + 4 KPIs em cards lado a lado (números enormes em gold)
POR QUE BACKUP ONLINE — grid 2x4 com ícone SVG circular (anel dourado, fill navy)
ONDE SEUS DADOS FICAM — 4 cards horizontais com ícone + título + texto
STACK & TECNOLOGIAS — faixa cream com chips (texto navy, borda dourada fina)
ESTA SOLUÇÃO É IDEAL SE... — 4 perfis em 2 colunas com numeral dourado 01..04
IDENTIFICAÇÃO DO CLIENTE — tabela navy/cream
[BLOCO FINANCEIRO atômico]
  CONFIGURAÇÃO INICIAL (tabela navy header, gold no subtotal)
  CENÁRIO MENSAL (tabela navy, linha total em gradiente navy + gold no valor)
  Aviso "não inclusos" em creme com filete dourado
  Observações (se houver)
[BLOCO SUPORTE atômico]
  Texto + lista de requisitos com bullets dourados ◆
CITAÇÃO institucional — bloco creme com aspa gigante dourada decorativa
[BLOCO ACEITE+RODAPÉ atômico]
  Linhas de assinatura
  QR + hash em card creme com borda navy
```

### Helpers visuais novos (no próprio arquivo)
- `sectionTitle(text)` — eyebrow dourado fino + título uppercase navy + filete gradiente
- `kpiCard(value, label)` — número 32px em gold, label uppercase muted
- `iconCircle(svgPath)` — círculo navy 40px com ícone gold dentro
- `numberedItem(n, title, text)` — numeral 01..04 em outline dourado grande
- `quoteBlock(text, author)` — fundo cream, aspa " gigante dourada (60px), texto serif italic
- `chip(text)` — pill cream com borda dourada 1px
- Filete decorativo `<hr>` com gradiente `transparent → gold → transparent`

### Tipografia
- Títulos de seção: 13px, uppercase, letter-spacing 2.5px, weight 800, navy
- Eyebrows / labels: 9px, uppercase, letter-spacing 1.5px, gold
- Números KPI: 32px, weight 800, gold
- Citação: 13px, italic, ink, com aspa decorativa
- Corpo: 11px, line-height 1.7, ink

### Quebras de página (mantidas e estendidas)
`tryPushAcross` aplicado a:
- `prop-financ-block` (configuração + cenário + não-inclusos + obs)
- `prop-suporte-block` (suporte + requisitos)
- `prop-aceite-block` (aceite + rodapé QR)
Nenhum total, nota ou assinatura quebra entre páginas.

## Resultado esperado

PDF com cara de proposta de consultoria premium (Navy & Gold), com ritmo visual: KPIs em destaque, cards com ícones, faixa de stack, citação institucional decorada — sem perder a objetividade comercial nem inventar logos de terceiros.
