/**
 * Modelo 03 - Gerador de PDF usando jsPDF puro (sem html2canvas).
 * Texto 100% limpo, sem espacamentos irregulares.
 * Design: Navy + Slate, tipografia Helvetica (similar ao Inter).
 */

import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import { DELTA7_LOGO_DATA_URL, DELTA7_LOGO_DARK_DATA_URL } from '@/assets/delta7LogoBase64';
import { ALTATEK_LOGO_DATA_URL } from '@/assets/altatekLogoBase64';
import {
  ABOUT_DELTA7,
  NOT_INCLUDED,
  SUPPORT_TEXT,
  SUPPORT_REQUIREMENTS,
  formatBRL,
  DELTA7_KPIS,
  BENEFIT_CARDS,
  INFRA_HIGHLIGHTS,
  IDEAL_FOR,
  INSTITUTIONAL_QUOTE,
  DEFAULT_SECTIONS,
  type ProposalSections,
} from '@/lib/proposalContent';
import type { FeaturedClientPdf } from './proposalClientsBlock';
import type { CommercialProposalPdfData } from './commercialProposalPdf';

//  Cores 
const NAVY   = [10, 31, 68]   as [number, number, number];
const SLATE  = [71, 85, 105]  as [number, number, number];
const INK    = [26, 37, 64]   as [number, number, number];
const MUTED  = [100, 116, 139] as [number, number, number];
const CREAM  = [241, 245, 249] as [number, number, number];
const PAPER  = [248, 250, 252] as [number, number, number];
const BORDER = [226, 232, 240] as [number, number, number];
const WHITE  = [255, 255, 255] as [number, number, number];

//  Dimensoes A4 
const PW = 210; // page width mm
const PH = 297; // page height mm
const ML = 18;  // margin left
const MR = 18;  // margin right
const CW = PW - ML - MR; // content width = 174mm

//  Helpers 

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '-';

/** Trunca texto para caber em maxW mm com a fonte atual */
function truncate(doc: jsPDF, text: string, maxW: number): string {
  while (doc.getTextWidth(text) > maxW && text.length > 3) {
    text = text.slice(0, -2) + '...';
  }
  return text;
}

/** Quebra texto em linhas que cabem em maxW */
function wrapText(doc: jsPDF, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (doc.getTextWidth(test) <= maxW) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/** Desenha texto com quebra de linha automatica e retorna Y final */
function drawWrapped(doc: jsPDF, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const lines = wrapText(doc, text, maxW);
  for (const line of lines) {
    doc.text(line, x, y);
    y += lineH;
  }
  return y;
}

/** Desenha um retangulo preenchido */
function fillRect(doc: jsPDF, x: number, y: number, w: number, h: number, color: [number, number, number]) {
  doc.setFillColor(...color);
  doc.rect(x, y, w, h, 'F');
}

/** Linha horizontal */
function hline(doc: jsPDF, x: number, y: number, w: number, color: [number, number, number], thickness = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(thickness);
  doc.line(x, y, x + w, y);
}

/** Texto com fonte/tamanho/cor configurados */
function t(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  opts: {
    size?: number;
    style?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    color?: [number, number, number];
    align?: 'left' | 'right' | 'center';
    maxWidth?: number;
  } = {}
) {
  const { size = 10, style = 'normal', color = INK, align = 'left', maxWidth } = opts;
  doc.setFontSize(size);
  doc.setFont('helvetica', style);
  doc.setTextColor(...color);
  if (maxWidth) {
    doc.text(text, x, y, { align, maxWidth });
  } else {
    doc.text(text, x, y, { align });
  }
}

//  Cabecalho de pagina interna 
function drawPageHeader(doc: jsPDF, propNum: string, logoDataUrl: string) {
  // Logo
  try {
    doc.addImage(logoDataUrl, 'PNG', ML, 8, 28, 10);
  } catch {}
  // Numero da proposta
  t(doc, 'Proposta Comercial', ML + CW, 12, { size: 7, color: MUTED, align: 'right' });
  t(doc, `No ${propNum}`, ML + CW, 16, { size: 10, style: 'bold', color: NAVY, align: 'right' });
  // Linha divisoria navy
  hline(doc, ML, 20, CW, NAVY, 0.6);
  // Barra slate curta
  doc.setFillColor(...SLATE);
  doc.rect(ML, 20.4, 12, 1, 'F');
}

//  Titulo de secao 
function sectionTitle(doc: jsPDF, eyebrow: string, title: string, y: number): number {
  // Eyebrow
  t(doc, eyebrow.toUpperCase(), ML, y, { size: 7, color: MUTED });
  y += 4;
  // Titulo bold
  t(doc, title, ML, y, { size: 13, style: 'bold', color: NAVY });
  // Linha gradiente (simulada com linha solida SLATE)
  const titleW = doc.getTextWidth(title) + 4;
  hline(doc, ML + titleW, y - 2.5, CW - titleW, SLATE, 0.4);
  return y + 5;
}

//  CAPA 
function drawCover(doc: jsPDF, r: CommercialProposalPdfData) {
  // Fundo navy
  fillRect(doc, 0, 0, PW, PH, NAVY);

  //  Logo Delta7 (canto superior esquerdo) 
  try {
    doc.addImage(DELTA7_LOGO_DATA_URL, 'PNG', ML, 16, 36, 14);
  } catch {}

  //  Altatek badge (canto superior direito) 
  if (r.showAltatekLogo) {
    // Fundo branco
    fillRect(doc, ML + CW - 36, 14, 36, 18, WHITE);
    t(doc, 'REVENDA AUTORIZADA', ML + CW - 18, 19.5, { size: 5.5, color: MUTED, align: 'center' });
    try {
      doc.addImage(ALTATEK_LOGO_DATA_URL, 'PNG', ML + CW - 33, 21, 30, 9);
    } catch {}
  } else {
    // so o texto Delta7
    t(doc, 'DELTA7 TECNOLOGIA', ML + CW, 20, { size: 7, color: [148, 163, 184], align: 'right' });
  }

  //  Linha decorativa curta 
  doc.setFillColor(71, 85, 105);
  doc.rect(ML, 80, 20, 1.5, 'F');

  //  Tag "Proposta Comercial" 
  t(doc, 'P R O P O S T A   C O M E R C I A L', ML, 90, { size: 8, color: [148, 163, 184] });

  //  Titulo BACKUP 
  doc.setFontSize(56);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('BACKUP', ML, 118);

  //  Subtitulo "Online." em slate 
  doc.setFontSize(56);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(71, 85, 105);
  doc.text('Online.', ML, 140);

  //  Slogan 
  t(doc, 'Continuidade do seu negocio', ML, 154, { size: 14, color: [203, 213, 225], style: 'normal' });
  t(doc, 'protegida com tecnologia de verdade.', ML, 161, { size: 14, color: [203, 213, 225], style: 'normal' });

  //  Rodape da capa 
  hline(doc, ML, PH - 38, CW, [30, 58, 110], 0.5);

  t(doc, 'PREPARADO PARA', ML, PH - 31, { size: 7, color: [148, 163, 184] });
  t(doc, r.clientName, ML, PH - 25, { size: 12, style: 'bold', color: WHITE });
  t(doc, `Proposta no ${r.proposalNumber}`, ML, PH - 19, { size: 9, color: [185, 194, 214] });

  t(doc, 'EMITIDA EM', ML + CW, PH - 31, { size: 7, color: [148, 163, 184], align: 'right' });
  t(doc, fmtDate(r.generatedAt), ML + CW, PH - 25, { size: 12, style: 'bold', color: WHITE, align: 'right' });
  t(doc, `Validade: ${r.validityDays} dias`, ML + CW, PH - 19, { size: 9, color: [185, 194, 214], align: 'right' });
}

//  SOBRE + BENEFICIOS 
function drawSobreBeneficios(doc: jsPDF, r: CommercialProposalPdfData, S: ProposalSections): void {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber, DELTA7_LOGO_DARK_DATA_URL);
  let y = 28;

  if (S.showAbout) {
    y = sectionTitle(doc, 'Quem somos', 'Sobre a Delta7 Tecnologia', y);
    // Texto sobre
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    const paraLines = doc.splitTextToSize(ABOUT_DELTA7.replace(/\n\n/g, ' ').replace(/\n/g, ' '), CW);
    // So as duas primeiras linhas de paragrafo para economizar espaco
    const aboutShort = ABOUT_DELTA7.split('\n\n').slice(0, 2).join(' ');
    const lines = doc.splitTextToSize(aboutShort, CW);
    doc.text(lines, ML, y);
    y += lines.length * 4.5 + 4;

    // KPIs
    const kpiW = CW / 3;
    DELTA7_KPIS.forEach((k, i) => {
      const kx = ML + i * kpiW;
      fillRect(doc, kx + 1, y, kpiW - 2, 18, CREAM);
      // Borda top slate
      doc.setFillColor(...SLATE);
      doc.rect(kx + 1, y, kpiW - 2, 1, 'F');
      t(doc, k.value, kx + kpiW / 2, y + 9, { size: 18, style: 'bold', color: NAVY, align: 'center' });
      t(doc, k.label.toUpperCase(), kx + kpiW / 2, y + 15, { size: 6.5, color: MUTED, align: 'center' });
    });
    y += 24;
  }

  if (S.showBenefits) {
    y = sectionTitle(doc, 'Vantagens', 'Por que Backup Online', y);
    const cardW = CW / 4;
    const cardH = 28;
    const rows = [BENEFIT_CARDS.slice(0, 4), BENEFIT_CARDS.slice(4, 8)];
    for (const row of rows) {
      row.forEach((b, i) => {
        const cx = ML + i * cardW;
        fillRect(doc, cx + 1, y, cardW - 2, cardH, PAPER);
        hline(doc, cx + 1, y, cardW - 2, BORDER, 0.3);
        hline(doc, cx + 1, y + cardH, cardW - 2, BORDER, 0.3);
        doc.setDrawColor(...BORDER);
        doc.setLineWidth(0.3);
        doc.line(cx + 1, y, cx + 1, y + cardH);
        doc.line(cx + cardW - 1, y, cx + cardW - 1, y + cardH);
        t(doc, b.title, cx + cardW / 2, y + 9, { size: 8.5, style: 'bold', color: NAVY, align: 'center' });
        const descLines = doc.splitTextToSize(b.text, cardW - 6);
        doc.setFontSize(7.5);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...MUTED);
        doc.text(descLines, cx + cardW / 2, y + 14, { align: 'center' });
      });
      y += cardH + 2;
    }
  }
}

//  CLIENTES + IDENTIFICACAO 
function drawClientesIdentificacao(
  doc: jsPDF,
  r: CommercialProposalPdfData,
  S: ProposalSections
): void {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber, DELTA7_LOGO_DARK_DATA_URL);
  let y = 28;

  // Clientes em destaque
  if (S.showClients && r.featuredClients && r.featuredClients.length > 0) {
    y = sectionTitle(doc, 'Confianca', 'Clientes que confiam na Delta7', y);
    t(doc, 'Algumas das empresas que confiam na Delta7 para gestao e suporte de TI:', ML, y, { size: 8.5, color: MUTED });
    y += 5;

    const colCount = 5;
    const cellW = CW / colCount;
    const cellH = 14;
    const clients = r.featuredClients;
    let col = 0;
    let rowY = y;
    for (let i = 0; i < clients.length; i++) {
      const cx = ML + col * cellW;
      // Borda da celula
      fillRect(doc, cx + 1, rowY, cellW - 2, cellH, WHITE);
      doc.setDrawColor(...BORDER);
      doc.setLineWidth(0.3);
      doc.rect(cx + 1, rowY, cellW - 2, cellH);

      const c = clients[i];
      if (c.logo_url) {
        try {
          doc.addImage(c.logo_url, 'PNG', cx + 3, rowY + 2, cellW - 8, cellH - 4);
        } catch {
          t(doc, truncate(doc, c.name, cellW - 6), cx + cellW / 2, rowY + cellH / 2 + 2, {
            size: 7, style: 'bold', color: NAVY, align: 'center',
          });
        }
      } else {
        const name = truncate(doc, c.name, cellW - 6);
        t(doc, name, cx + cellW / 2, rowY + cellH / 2 + 2, {
          size: 7, style: 'bold', color: NAVY, align: 'center',
        });
      }

      col++;
      if (col >= colCount) {
        col = 0;
        rowY += cellH + 1;
      }
    }
    if (col > 0) rowY += cellH + 1;
    y = rowY + 4;
  }

  // Identificacao do cliente
  y = sectionTitle(doc, 'Cliente', 'Identificacao do Cliente', y);
  const tableRows = [
    ['Razao Social', r.clientName, '', ''],
    ['CNPJ / CPF', r.clientDocument || '-', 'Contato', r.clientContact || '-'],
    ['E-mail', r.clientEmail || '-', 'Endereco', r.clientAddress || '-'],
  ];
  y = drawInfoTable(doc, tableRows, y);
  y += 6;

  // Executivo Responsavel
  y = sectionTitle(doc, 'Delta7', 'Executivo Responsavel', y);
  drawInfoTable(doc, [
    ['Executivo de Vendas', r.salesRepName, 'E-mail', r.salesRepEmail || '-'],
  ], y);
}

/** Tabela de info (label / valor) */
function drawInfoTable(doc: jsPDF, rows: string[][], y: number): number {
  const rowH = 8;
  const col1W = CW * 0.22;
  const col2W = CW * 0.28;
  const col3W = CW * 0.20;
  const col4W = CW * 0.30;

  for (let ri = 0; ri < rows.length; ri++) {
    const [l1, v1, l2, v2] = rows[ri];
    const isLast = ri === rows.length - 1;
    const borderB = isLast ? BORDER : [241, 245, 249] as [number, number, number];

    // Label 1 (fundo cream)
    fillRect(doc, ML, y, col1W, rowH, CREAM);
    t(doc, l1, ML + 2, y + 5.5, { size: 8.5, style: 'bold', color: NAVY });

    // Valor 1
    t(doc, truncate(doc, v1, (l2 ? col2W : col2W + col3W + col4W) - 4), ML + col1W + 2, y + 5.5, { size: 8.5, color: INK });

    if (l2) {
      // Label 2
      fillRect(doc, ML + col1W + col2W, y, col3W, rowH, CREAM);
      t(doc, l2, ML + col1W + col2W + 2, y + 5.5, { size: 8.5, style: 'bold', color: NAVY });
      // Valor 2
      t(doc, truncate(doc, v2, col4W - 4), ML + col1W + col2W + col3W + 2, y + 5.5, { size: 8.5, color: INK });
    }

    // Borda
    hline(doc, ML, y + rowH, CW, borderB, 0.3);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(ML, y, ML, y + rowH);
    doc.line(ML + CW, y, ML + CW, y + rowH);
    y += rowH;
  }
  // Borda top
  hline(doc, ML, y - rows.length * rowH, CW, BORDER, 0.3);
  return y;
}

//  INVESTIMENTO 
function drawInvestimento(doc: jsPDF, r: CommercialProposalPdfData): void {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber, DELTA7_LOGO_DARK_DATA_URL);
  let y = 28;

  // Tabela Ativacao
  y = sectionTitle(doc, 'Investimento', 'Configuracao inicial', y);
  y = drawItemsTable(doc, [
    { desc: 'Ativacao do Servico (taxa unica)', qty: 1, unit: r.activationFee },
  ], y);
  y += 6;

  // Tabela Mensalidade
  y = sectionTitle(doc, 'Mensalidade', 'Cenario com Backup Online', y);
  const items = r.items.filter(i => i.qty > 0);
  y = drawItemsTable(doc, items.map(i => ({ desc: i.description, qty: i.qty, unit: i.unit_price })), y);
  y += 6;

  // Resumo
  const itemsSubtotal = items.reduce((s, i) => s + i.qty * i.unit_price, 0);
  const discount = r.discount || 0;
  const monthly = itemsSubtotal - discount;
  const firstMonth = monthly + (r.activationFee || 0);

  y = drawSummaryBox(doc, {
    subtotal: itemsSubtotal,
    discount,
    monthly,
    activation: r.activationFee || 0,
    firstMonth,
  }, y);
  y += 4;

  // Nao inclusos
  fillRect(doc, ML, y, CW, 1, SLATE);
  fillRect(doc, ML, y, 2.5, 10, SLATE);
  fillRect(doc, ML, y, CW, 10, PAPER);
  t(doc, 'Nao inclusos:', ML + 5, y + 6.5, { size: 8.5, style: 'bold', color: NAVY });
  const niText = truncate(doc, NOT_INCLUDED.replace('Nesta proposta nao estao inclusos: ', ''), CW - 40);
  t(doc, niText, ML + 34, y + 6.5, { size: 8.5, color: INK });
  y += 14;

  // Observacoes
  if (r.notes) {
    fillRect(doc, ML, y, 2.5, 14, NAVY);
    t(doc, 'Observacoes', ML + 5, y + 5.5, { size: 8.5, style: 'bold', color: NAVY });
    const notesLines = doc.splitTextToSize(r.notes, CW - 10);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(notesLines.slice(0, 2), ML + 5, y + 11);
  }
}

function drawItemsTable(
  doc: jsPDF,
  items: { desc: string; qty: number; unit: number }[],
  y: number
): number {
  const hH = 8;
  const rowH = 7.5;
  const colDesc = CW * 0.52;
  const colQty = CW * 0.12;
  const colUnit = CW * 0.18;
  const colSub = CW * 0.18;

  // Header
  fillRect(doc, ML, y, CW, hH, NAVY);
  t(doc, 'ITEM', ML + 3, y + 5.5, { size: 7.5, style: 'bold', color: WHITE });
  t(doc, 'QTD', ML + colDesc + colQty / 2, y + 5.5, { size: 7.5, style: 'bold', color: WHITE, align: 'center' });
  t(doc, 'VALOR UNIT.', ML + colDesc + colQty + colUnit, y + 5.5, { size: 7.5, style: 'bold', color: WHITE, align: 'right' });
  t(doc, 'SUBTOTAL', ML + CW, y + 5.5, { size: 7.5, style: 'bold', color: WHITE, align: 'right' });
  y += hH;

  items.forEach((item, idx) => {
    const rowColor = idx % 2 === 0 ? WHITE : PAPER;
    fillRect(doc, ML, y, CW, rowH, rowColor);
    t(doc, truncate(doc, item.desc, colDesc - 6), ML + 3, y + 5, { size: 8.5, color: INK });
    t(doc, String(item.qty), ML + colDesc + colQty / 2, y + 5, { size: 8.5, color: INK, align: 'center' });
    t(doc, formatBRL(item.unit), ML + colDesc + colQty + colUnit, y + 5, { size: 8.5, color: INK, align: 'right' });
    t(doc, formatBRL(item.qty * item.unit), ML + CW, y + 5, { size: 8.5, style: 'bold', color: NAVY, align: 'right' });
    hline(doc, ML, y + rowH, CW, BORDER, 0.2);
    y += rowH;
  });

  // Total row
  fillRect(doc, ML, y, CW, 9, NAVY);
  t(doc, 'CUSTO MENSAL TOTAL', ML + colDesc - 3, y + 6, { size: 7.5, color: WHITE, align: 'right' });
  const total = items.reduce((s, i) => s + i.qty * i.unit, 0);
  t(doc, formatBRL(total), ML + CW, y + 6.5, { size: 13, style: 'bold', color: WHITE, align: 'right' });
  y += 9;

  // Borda
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.rect(ML, y - items.length * rowH - hH - 9, CW, items.length * rowH + hH + 9);

  return y;
}

function drawSummaryBox(
  doc: jsPDF,
  data: { subtotal: number; discount: number; monthly: number; activation: number; firstMonth: number },
  y: number
): number {
  const rowH = 7.5;
  const rows: { label: string; value: string; bold?: boolean; highlight?: boolean }[] = [
    { label: 'Subtotal mensal (itens)', value: formatBRL(data.subtotal) },
  ];
  if (data.discount > 0) {
    rows.push({ label: '() Desconto mensal', value: ` ${formatBRL(data.discount)}` });
  }
  rows.push({ label: '= Mensalidade recorrente', value: formatBRL(data.monthly), bold: true });
  rows.push({ label: '(+) Taxa de Ativacao (cobrada uma unica vez)', value: formatBRL(data.activation) });
  rows.push({ label: 'INVESTIMENTO NO 1o MES', value: formatBRL(data.firstMonth), highlight: true });

  // Header do resumo
  fillRect(doc, ML, y, CW, rowH, CREAM);
  t(doc, 'RESUMO DO INVESTIMENTO', ML + 3, y + 5.5, { size: 7.5, style: 'bold', color: NAVY });
  hline(doc, ML, y + rowH, CW, BORDER, 0.3);
  y += rowH;

  rows.forEach(row => {
    if (row.highlight) {
      fillRect(doc, ML, y, CW, 9, NAVY);
      t(doc, row.label, ML + 3, y + 6, { size: 8.5, style: 'bold', color: WHITE });
      t(doc, row.value, ML + CW, y + 6.5, { size: 13, style: 'bold', color: WHITE, align: 'right' });
      y += 9;
    } else {
      fillRect(doc, ML, y, CW, rowH, row.bold ? PAPER : WHITE);
      t(doc, row.label, ML + 3, y + 5, { size: 8.5, style: row.bold ? 'bold' : 'normal', color: row.bold ? NAVY : INK });
      t(doc, row.value, ML + CW, y + 5, { size: 8.5, style: row.bold ? 'bold' : 'normal', color: row.bold ? NAVY : INK, align: 'right' });
      hline(doc, ML, y + rowH, CW, BORDER, 0.2);
      y += rowH;
    }
  });

  // Nota
  fillRect(doc, ML, y, CW, 7, PAPER);
  t(doc, `A partir do 2o mes, o valor recorrente e de ${formatBRL(data.monthly)}/mes.`, ML + 3, y + 4.5, {
    size: 7.5, style: 'italic', color: MUTED,
  });
  y += 7;

  // Borda geral
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  const totalH = rows.length * rowH + rowH + 7 + 4; // approx
  doc.rect(ML, y - totalH, CW, totalH);

  return y;
}

//  SUPORTE 
function drawSuporte(doc: jsPDF, r: CommercialProposalPdfData, S: ProposalSections): void {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber, DELTA7_LOGO_DARK_DATA_URL);
  let y = 28;

  y = sectionTitle(doc, 'Atendimento', 'Suporte Tecnico', y);

  // Paragrafos do SUPPORT_TEXT
  const paras = SUPPORT_TEXT.split('\n\n');
  for (const para of paras) {
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(para.replace(/\n/g, ' '), CW);
    doc.text(lines, ML, y);
    y += lines.length * 4.5 + 4;
  }

  if (S.showSupportReqs) {
    t(doc, 'Requisitos para a prestacao dos servicos', ML, y, { size: 9.5, style: 'bold', color: NAVY });
    y += 6;
    for (const req of SUPPORT_REQUIREMENTS) {
      t(doc, '', ML, y, { size: 7, color: SLATE });
      const reqLines = doc.splitTextToSize(req, CW - 8);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...MUTED);
      doc.text(reqLines, ML + 6, y);
      y += reqLines.length * 4.2 + 1.5;
    }
    y += 4;
  }

  // Quote institucional
  if (S.showQuote) {
    fillRect(doc, ML, y, CW, 24, PAPER);
    // Aspas decorativas
    t(doc, '"', ML + 4, y + 10, { size: 24, style: 'bold', color: SLATE });
    const qLines = doc.splitTextToSize(INSTITUTIONAL_QUOTE.text, CW - 20);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(...INK);
    doc.text(qLines, ML + 13, y + 8);
    t(doc, `- ${INSTITUTIONAL_QUOTE.author}`, ML + 13, y + qLines.length * 4.5 + 10, {
      size: 7, color: SLATE,
    });
  }
}

//  ACEITE + HASH 
async function drawAceite(doc: jsPDF, r: CommercialProposalPdfData): Promise<void> {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber, DELTA7_LOGO_DARK_DATA_URL);
  let y = 28;

  y = sectionTitle(doc, 'Formalizacao', 'Aceite da Proposta', y);

  t(doc, `Declaro estar de acordo com os termos, valores e condicoes apresentados nesta proposta`, ML, y, { size: 8.5, color: MUTED });
  y += 4.5;
  t(doc, `comercial, emitida em ${fmtDate(r.generatedAt)} com validade de ${r.validityDays} dias.`, ML, y, { size: 8.5, color: MUTED });
  y += 18;

  // Linhas de assinatura
  hline(doc, ML, y, CW * 0.45, NAVY, 0.5);
  hline(doc, ML + CW * 0.55, y, CW * 0.45, NAVY, 0.5);

  y += 5;
  t(doc, r.clientName, ML + CW * 0.225, y, { size: 9, style: 'bold', color: NAVY, align: 'center' });
  t(doc, 'Delta7 Tecnologia', ML + CW * 0.775, y, { size: 9, style: 'bold', color: NAVY, align: 'center' });
  y += 4.5;
  t(doc, 'CLIENTE', ML + CW * 0.225, y, { size: 7, color: MUTED, align: 'center' });
  t(doc, `${r.salesRepName.toUpperCase()} - EXECUTIVO DE VENDAS`, ML + CW * 0.775, y, { size: 7, color: MUTED, align: 'center' });
  y += 12;

  // QR Code + Hash
  const validationUrl = r.validationUrl || `${typeof window !== 'undefined' ? window.location.origin : 'https://delta7tecnologia.com.br'}/validar-proposta/${r.integrityHash}`;

  fillRect(doc, ML, y, CW, 34, PAPER);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 34);

  // QR Code
  try {
    const qrDataUrl = await QRCode.toDataURL(validationUrl, {
      margin: 1, width: 160, errorCorrectionLevel: 'M',
      color: { dark: '#0a1f44', light: '#ffffff' },
    });
    doc.addImage(qrDataUrl, 'PNG', ML + 3, y + 3, 28, 28);
  } catch {}

  // Hash info
  t(doc, 'HASH DE LEGITIMIDADE SHA-256', ML + 35, y + 7, { size: 7, style: 'bold', color: MUTED });
  // Hash em fonte mono
  doc.setFontSize(7);
  doc.setFont('courier', 'normal');
  doc.setTextColor(...NAVY);
  fillRect(doc, ML + 35, y + 9, CW - 38, 6, WHITE);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.2);
  doc.rect(ML + 35, y + 9, CW - 38, 6);
  doc.text(r.integrityHash, ML + 36, y + 13.5);

  t(doc, `Link: ${validationUrl.substring(0, 70)}${validationUrl.length > 70 ? '...' : ''}`, ML + 35, y + 20, { size: 6.5, color: MUTED });
  t(doc, 'Documento emitido eletronicamente pela plataforma Delta7. Autenticidade verificavel pelo QR Code ou link acima.', ML + 35, y + 25, { size: 6.5, style: 'italic', color: MUTED });
  t(doc, 'VALIDAR PROPOSTA  |  Escaneie para verificar autenticidade', ML + 17, y + 31.5, { size: 6, color: SLATE, align: 'center' });
}

//  MONTAGEM FINAL 
export async function buildModelo03(r: CommercialProposalPdfData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const S: ProposalSections = { ...DEFAULT_SECTIONS, ...(r.sections || {}) };

  // Pagina 1: Capa
  drawCover(doc, r);

  // Pagina 2: Sobre + Beneficios (se habilitados)
  if (S.showAbout || S.showBenefits) {
    drawSobreBeneficios(doc, r, S);
  }

  // Pagina 3: Clientes + Identificacao
  drawClientesIdentificacao(doc, r, S);

  // Pagina 4: Investimento
  drawInvestimento(doc, r);

  // Pagina 5: Suporte (se habilitado)
  if (S.showSupportReqs || S.showQuote) {
    drawSuporte(doc, r, S);
  }

  // Ultima pagina: Aceite
  await drawAceite(doc, r);

  return doc;
}

export async function downloadModelo03(r: CommercialProposalPdfData): Promise<void> {
  const doc = await buildModelo03(r);
  const filename = `Proposta_${r.proposalNumber}_Modelo03.pdf`;
  try {
    const blob = doc.output('blob') as Blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 4000);
  } catch {
    doc.save(filename);
  }
}

export async function previewModelo03(r: CommercialProposalPdfData): Promise<string[]> {
  const doc = await buildModelo03(r);
  const totalPages = (doc as any).internal.getNumberOfPages();
  const pages: string[] = [];
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    pages.push(doc.output('datauristring'));
  }
  return pages;
}
