/**
 * Helpers compartilhados para geração de PDFs nativos com jsPDF.
 * Substitui a abordagem antiga baseada em html2canvas (que produzia
 * texto rasterizado com palavras coladas e quebras de página cortadas).
 */
import jsPDF from 'jspdf';
import { DELTA7_LOGO_DATA_URL } from '@/assets/delta7LogoBase64';

export const PAGE = {
  width: 210, // A4 mm
  height: 297,
  marginX: 15,
  marginTop: 15,
  marginBottom: 18,
  headerHeight: 28, // espaço reservado para o cabeçalho timbrado
  footerHeight: 12, // espaço reservado para rodapé / paginação
};

export const contentWidth = PAGE.width - PAGE.marginX * 2;

export interface HeaderInfo {
  title: string; // ex.: "DELTA7 SOLUÇÕES EM TECNOLOGIA"
  subtitle: string; // ex.: "LAUDO TÉCNICO DE EQUIPAMENTO — Computador..."
  reportNumber: string;
  generatedAt: string; // ISO
}

export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export const fmtDate = (iso: string) => {
  if (!iso) return '___/___/______';
  try { return new Date(iso).toLocaleDateString('pt-BR'); }
  catch { return iso; }
};

/** Desenha o cabeçalho timbrado no topo da página atual. */
export function drawHeader(pdf: jsPDF, info: HeaderInfo) {
  const x = PAGE.marginX;
  const y = PAGE.marginTop;

  // Logo Delta7
  try {
    pdf.addImage(DELTA7_LOGO_DATA_URL, 'PNG', x, y - 4, 22, 22);
  } catch { /* ignora se a logo falhar */ }

  // Bloco de título
  pdf.setTextColor(30, 58, 138); // azul Delta7
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(13);
  pdf.text(info.title, x + 26, y + 4);

  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  const subtitleLines = pdf.splitTextToSize(info.subtitle, contentWidth - 90);
  pdf.text(subtitleLines, x + 26, y + 9);

  // Lateral direita: número + data
  pdf.setTextColor(30, 58, 138);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(`Nº ${info.reportNumber}`, PAGE.width - PAGE.marginX, y + 4, { align: 'right' });

  pdf.setTextColor(100, 116, 139);
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(8.5);
  pdf.text(fmtDateTime(info.generatedAt), PAGE.width - PAGE.marginX, y + 9, { align: 'right' });

  // Linha azul inferior
  pdf.setDrawColor(30, 58, 138);
  pdf.setLineWidth(1.2);
  pdf.line(x, y + 18, PAGE.width - PAGE.marginX, y + 18);

  // Reset cor de texto p/ corpo
  pdf.setTextColor(30, 41, 59);
  pdf.setLineWidth(0.2);
}

/** Rodapé com paginação. Aplica em TODAS as páginas no fim da geração. */
export function drawFooters(pdf: jsPDF, hash?: string) {
  const total = pdf.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    pdf.setPage(i);
    const y = PAGE.height - 8;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text(`Página ${i} de ${total}`, PAGE.width - PAGE.marginX, y, { align: 'right' });
    if (hash && i === total) {
      // hash já foi desenhado dentro do conteúdo; nada a fazer aqui
    }
    pdf.setTextColor(30, 41, 59);
  }
}

/**
 * Cursor de layout — controla o Y atual e faz quebra de página
 * automática quando o bloco que vai ser desenhado não cabe.
 */
export class PdfCursor {
  y: number;
  constructor(public pdf: jsPDF, public header: HeaderInfo) {
    this.y = PAGE.marginTop + PAGE.headerHeight;
  }

  /** Espaço disponível abaixo do cursor. */
  availableHeight(): number {
    return PAGE.height - PAGE.marginBottom - PAGE.footerHeight - this.y;
  }

  /** Garante que existem `needed` mm restantes na página, ou abre uma nova. */
  ensure(needed: number) {
    if (this.availableHeight() < needed) {
      this.newPage();
    }
  }

  newPage() {
    this.pdf.addPage();
    drawHeader(this.pdf, this.header);
    this.y = PAGE.marginTop + PAGE.headerHeight;
  }

  /** Avança o cursor. */
  advance(mm: number) {
    this.y += mm;
  }
}

/** Desenha um título de seção (faixa azul). Sempre garante espaço. */
export function drawSectionTitle(c: PdfCursor, num: string, text: string) {
  const h = 8;
  c.ensure(h + 4); // título + algum espaço para o que vem depois
  const { pdf } = c;
  pdf.setFillColor(30, 58, 138);
  pdf.rect(PAGE.marginX, c.y, contentWidth, h, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(`${num}. ${text}`, PAGE.marginX + 4, c.y + 5.5);
  pdf.setTextColor(30, 41, 59);
  c.advance(h + 3);
}

/** Desenha um parágrafo justificável com quebra de página automática. */
export function drawParagraph(
  c: PdfCursor,
  text: string,
  opts: { fontSize?: number; bold?: boolean; color?: [number, number, number]; lineHeight?: number; indent?: number; maxWidth?: number } = {}
) {
  if (!text) return;
  const { pdf } = c;
  const fs = opts.fontSize ?? 10;
  const lh = opts.lineHeight ?? fs * 0.45;
  pdf.setFont('helvetica', opts.bold ? 'bold' : 'normal');
  pdf.setFontSize(fs);
  if (opts.color) pdf.setTextColor(...opts.color);
  else pdf.setTextColor(51, 65, 85);

  const x = PAGE.marginX + (opts.indent ?? 0);
  const width = (opts.maxWidth ?? contentWidth) - (opts.indent ?? 0);
  const lines = pdf.splitTextToSize(text, width);

  for (const line of lines) {
    c.ensure(lh);
    pdf.text(line, x, c.y + fs * 0.35);
    c.advance(lh);
  }
  pdf.setTextColor(30, 41, 59);
}

/** Bloco destacado (background + barra lateral azul). */
export function drawCallout(c: PdfCursor, text: string, opts: { fontSize?: number } = {}) {
  if (!text) return;
  const { pdf } = c;
  const fs = opts.fontSize ?? 10;
  const lh = fs * 0.45;
  const padX = 4;
  const padY = 3;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(fs);
  const lines = pdf.splitTextToSize(text, contentWidth - padX * 2);
  const blockH = lines.length * lh + padY * 2;

  c.ensure(blockH);
  pdf.setFillColor(248, 250, 252);
  pdf.rect(PAGE.marginX, c.y, contentWidth, blockH, 'F');
  pdf.setFillColor(30, 58, 138);
  pdf.rect(PAGE.marginX, c.y, 1.2, blockH, 'F');

  pdf.setTextColor(51, 65, 85);
  let yy = c.y + padY;
  for (const line of lines) {
    pdf.text(line, PAGE.marginX + padX, yy + fs * 0.35);
    yy += lh;
  }
  c.advance(blockH + 2);
  pdf.setTextColor(30, 41, 59);
}

/** Insere uma imagem (foto / screenshot) com legenda em grade de 2 colunas. */
export function drawPhotoGrid(
  c: PdfCursor,
  photos: Array<{ dataUrl?: string; caption: string; external?: boolean; externalUrl?: string; externalProvider?: string }>
) {
  if (!photos.length) return;
  const { pdf } = c;
  const gap = 4;
  const colW = (contentWidth - gap) / 2;
  const photoH = 55; // mm
  const captionLineH = 3.5;

  for (let i = 0; i < photos.length; i += 2) {
    const left = photos[i];
    const right = photos[i + 1];

    // Calcula altura da linha (foto + maior legenda)
    const captionsLeft = pdf.splitTextToSize(left?.caption || ' ', colW);
    const captionsRight = right ? pdf.splitTextToSize(right.caption || ' ', colW) : [];
    const captionH = Math.max(captionsLeft.length, captionsRight.length) * captionLineH;
    const rowH = photoH + 2 + captionH + 4;

    c.ensure(rowH);

    drawPhotoCell(pdf, left, PAGE.marginX, c.y, colW, photoH, captionsLeft, captionLineH);
    if (right) {
      drawPhotoCell(pdf, right, PAGE.marginX + colW + gap, c.y, colW, photoH, captionsRight, captionLineH);
    }
    c.advance(rowH);
  }
}

function drawPhotoCell(
  pdf: jsPDF,
  p: { dataUrl?: string; caption: string; external?: boolean; externalUrl?: string; externalProvider?: string },
  x: number, y: number, w: number, h: number,
  captionLines: string[], captionLineH: number
) {
  if (p.external) {
    pdf.setDrawColor(148, 163, 184);
    pdf.setLineDashPattern([1.5, 1.2], 0);
    pdf.setFillColor(241, 245, 249);
    pdf.rect(x, y, w, h, 'FD');
    pdf.setLineDashPattern([], 0);

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(71, 85, 105);
    pdf.text('ANEXO EXTERNO', x + w / 2, y + 10, { align: 'center' });

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10);
    pdf.setTextColor(30, 58, 138);
    pdf.text(p.externalProvider || 'Link externo', x + w / 2, y + 18, { align: 'center' });

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    const urlLines = pdf.splitTextToSize(p.externalUrl || '', w - 4);
    let ly = y + 24;
    for (const ul of urlLines.slice(0, 5)) {
      pdf.text(ul, x + w / 2, ly, { align: 'center' });
      ly += 3;
    }
  } else if (p.dataUrl) {
    try {
      const fmt = p.dataUrl.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      pdf.addImage(p.dataUrl, fmt, x, y, w, h, undefined, 'FAST');
      pdf.setDrawColor(203, 213, 225);
      pdf.rect(x, y, w, h);
    } catch {
      pdf.setDrawColor(203, 213, 225);
      pdf.rect(x, y, w, h);
    }
  }

  // Legenda
  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(8);
  pdf.setTextColor(71, 85, 105);
  let cy = y + h + 3;
  for (const line of captionLines) {
    pdf.text(line, x + w / 2, cy, { align: 'center' });
    cy += captionLineH;
  }
  pdf.setTextColor(30, 41, 59);
}

/** Bloco final com hash de integridade. */
export function drawHashFooter(c: PdfCursor, hash: string) {
  if (!hash) return;
  const { pdf } = c;
  c.ensure(22);
  pdf.setDrawColor(30, 58, 138);
  pdf.setLineWidth(0.6);
  pdf.line(PAGE.marginX, c.y, PAGE.width - PAGE.marginX, c.y);
  pdf.setLineWidth(0.2);
  c.advance(3);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Hash de integridade SHA-256:', PAGE.marginX, c.y + 3);
  c.advance(4);

  pdf.setFillColor(241, 245, 249);
  const hashLines = pdf.splitTextToSize(hash, contentWidth - 4);
  const boxH = hashLines.length * 3.2 + 3;
  pdf.rect(PAGE.marginX, c.y, contentWidth, boxH, 'F');
  pdf.setFont('courier', 'normal');
  pdf.setFontSize(7.5);
  pdf.setTextColor(30, 58, 138);
  let yy = c.y + 3;
  for (const line of hashLines) {
    pdf.text(line, PAGE.marginX + 2, yy);
    yy += 3.2;
  }
  c.advance(boxH + 2);

  pdf.setFont('helvetica', 'italic');
  pdf.setFontSize(7.5);
  pdf.setTextColor(148, 163, 184);
  pdf.text(
    'Documento gerado eletronicamente pela plataforma Delta7 — integridade garantida pelo hash de segurança acima.',
    PAGE.width / 2, c.y + 2, { align: 'center' }
  );
  pdf.setTextColor(30, 41, 59);
}
