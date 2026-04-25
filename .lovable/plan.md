# Correção do PDF do laudo técnico

## Problemas confirmados no laudo `LDO-20260425-37NJ.pdf`

1. **Palavras coladas**: `LAUDO TÉCNICODE`, `Análisenarrativa`, `JustificativaTécnica`, `SSDpode`, `CRÍTICA—exige`, `PlacaMãe`. Causa: `html2canvas` rasteriza a página em JPEG e o kerning das fontes em escala 2x faz caracteres adjacentes perderem o espaço visual.
2. **Cortes na mudança de página**: títulos de seção (ex.: "5. DIAGNÓSTICO…" começando cortado no topo da página 2), fotos partidas, tabelas seccionadas. Causa: o código gera **uma única imagem gigante** e a fatia em alturas fixas de 297mm, sem respeitar limites de bloco.

Ambos os problemas afetam tanto `reportPdf.ts` (laudo simples) quanto `reportPdfAdvanced.ts` (laudo de patrimônio — o que você gerou).

## Solução: substituir html2canvas por jsPDF nativo (texto vetorial + quebras inteligentes)

Reescrever a geração para usar a API nativa do jsPDF (`pdf.text`, `pdf.rect`, `pdf.setFillColor`, `autoTable`) em vez de rasterizar HTML. Cada bloco (cabeçalho, tabela, parágrafo, seção de fotos) verifica se ainda cabe na página antes de desenhar; se não couber, chama `pdf.addPage()` e redesenha o cabeçalho timbrado.

### Vantagens
- **Texto vetorial real**: zero risco de palavras coladas. O PDF fica selecionável/pesquisável e muito mais leve.
- **Quebras de página por bloco**: nenhuma linha de tabela, título de seção ou foto é cortada ao meio. Se um bloco não cabe, vai inteiro para a próxima página.
- **Cabeçalho repetido**: logo Delta7 + nº do laudo aparecem no topo de cada página, com numeração "Página X de Y".
- **Fotos sem distorção**: cada imagem é colocada com `pdf.addImage` no seu próprio espaço, com legenda abaixo, e checa altura disponível antes de inserir.

### Bibliotecas
Usar `jspdf-autotable` (já compatível com o jsPDF que está no projeto) para as tabelas — gerencia automaticamente quebra de linha em células, repetição de cabeçalho da tabela e quebra de página dentro da tabela.

## Arquivos afetados

- `src/utils/reportPdfAdvanced.ts` — reescrita completa (laudo de patrimônio).
- `src/utils/reportPdf.ts` — reescrita completa (laudo simples segue o mesmo padrão).
- `package.json` — adicionar `jspdf-autotable`.
- `src/components/tech/reports/PdfPreviewDialog.tsx` — sem mudança (continua recebendo o `jsPDF`).

## Estrutura do novo gerador (pseudocódigo)

```text
initPdf()                          // A4, margens 15mm
drawHeader(page=1)                 // logo + título + nº + data + linha azul
y = 45

for cada seção (1..10):
    needSpace(sectionTitleHeight)  // se não couber, addPage + drawHeader
    drawSectionTitle("3. INSPEÇÃO DE HARDWARE")
    
    if seção é tabela:
        autoTable({ startY: y, didDrawPage: drawHeader, ... })
        y = pdf.lastAutoTable.finalY + 6
    
    if seção é texto:
        lines = pdf.splitTextToSize(texto, contentWidth)
        for cada linha:
            needSpace(lineHeight)
            pdf.text(linha, x, y); y += lineHeight
    
    if seção é fotos:
        for cada foto (grid 2 col):
            needSpace(photoHeight + captionHeight)
            pdf.addImage(...) ; pdf.text(legenda, ...)

drawFooter()                       // hash + "Página X de Y" em todas as páginas
```

## Validação

Após implementar, gerar novamente um laudo de teste com o mesmo conteúdo e conferir:
- Nenhuma palavra colada (`LAUDO TÉCNICO DE`, `Análise narrativa`, `Justificativa Técnica` separadas).
- Título "5. DIAGNÓSTICO…" inicia íntegro no topo da pág. 2 (não cortado).
- Foto que ficaria no limite vai inteira para a próxima página.
- Texto continua selecionável (Ctrl+C funciona no PDF).
- Pré-visualização no navegador continua funcionando normalmente (já usa `pdf.output('blob')`).

