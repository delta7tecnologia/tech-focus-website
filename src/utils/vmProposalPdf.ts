/**
 * VM Proposal PDF - Gerador seguindo o padrao Modelo 03
 * Design: Navy + Slate + Laranja Delta7
 * jsPDF puro, sem html2canvas
 */

import jsPDF from 'jspdf';
import { DELTA7_LOGO_DARK_SMALL, DELTA7_LOGO_WHITE_SMALL } from '@/assets/delta7LogoSmallBase64';

// ── Tipos ─────────────────────────────────────────────────────────────────────
export interface VmItem {
  nome: string;
  funcao: string;
  vcpus: number;
  ram: string;
  storage: string;
  so: string;
}

export interface VmPlano {
  prazo: string;
  mensal: number;
}

export interface VmProposalData {
  proposalNumber: string;
  generatedAt: string;
  validityDays: number;
  clientName: string;
  clientDocument?: string;
  clientContact?: string;
  clientEmail?: string;
  salesRepName: string;
  salesRepEmail?: string;
  vms: VmItem[];
  planos: VmPlano[];
  activationFee: number;
  notes?: string;
  integrityHash: string;
}

// ── Cores ─────────────────────────────────────────────────────────────────────
const NAVY    = [10,  31,  68]  as [number, number, number];
const SLATE   = [71,  85,  105] as [number, number, number];
const INK     = [26,  37,  64]  as [number, number, number];
const MUTED   = [100, 116, 139] as [number, number, number];
const CREAM   = [241, 245, 249] as [number, number, number];
const PAPER   = [248, 250, 252] as [number, number, number];
const BORDER  = [226, 232, 240] as [number, number, number];
const WHITE   = [255, 255, 255] as [number, number, number];
const ORANGE  = [232, 119,  34] as [number, number, number];
const ORANGE2 = [192,  90,   0] as [number, number, number];
const GREEN   = [ 30, 126,  52] as [number, number, number];

// ── Dimensoes A4 ──────────────────────────────────────────────────────────────
const PW = 210;
const PH = 297;
const ML = 18;
const MR = 18;
const CW = PW - ML - MR; // 174mm

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

const fmtDateShort = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR');

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const filterVms = (vms: VmItem[]): VmItem[] =>
  vms.filter((v) => (v.nome?.trim() ?? '') !== '' || (v.funcao?.trim() ?? '') !== '');

function truncate(doc: jsPDF, text: string, maxW: number): string {
  if (!text) return '';
  const lines = doc.splitTextToSize(text, maxW);
  return lines[0] || text.substring(0, 20);
}

function fillRect(doc: jsPDF, x: number, y: number, w: number, h: number, color: [number,number,number]) {
  doc.setFillColor(...color);
  doc.rect(x, y, w, h, 'F');
}

function hline(doc: jsPDF, x: number, y: number, w: number, color: [number,number,number], thickness = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(thickness);
  doc.line(x, y, x + w, y);
}

function t(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  opts: {
    size?: number;
    style?: 'normal' | 'bold' | 'italic' | 'bolditalic';
    color?: [number,number,number];
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

// ── Cabecalho de pagina ───────────────────────────────────────────────────────
function drawPageHeader(doc: jsPDF, propNum: string) {
  try {
    doc.addImage(DELTA7_LOGO_DARK_SMALL, 'JPEG', ML, 6, 30, 9);
  } catch {
    t(doc, 'Delta7', ML, 14, { size: 13, style: 'bold', color: NAVY });
  }
  t(doc, 'Proposta de Locacao de VMs', ML + CW, 10, { size: 7, color: MUTED, align: 'right' });
  t(doc, `N\u00ba ${propNum}`, ML + CW, 15, { size: 10, style: 'bold', color: NAVY, align: 'right' });
  hline(doc, ML, 20, CW, NAVY, 0.6);
  fillRect(doc, ML, 20.4, 12, 1, ORANGE);
}

// ── Titulo de secao ───────────────────────────────────────────────────────────
function sectionTitle(doc: jsPDF, eyebrow: string, title: string, y: number): number {
  t(doc, eyebrow.toUpperCase(), ML, y, { size: 7, color: MUTED });
  y += 4;
  t(doc, title, ML, y, { size: 13, style: 'bold', color: NAVY });
  const titleW = doc.getTextWidth(title) + 4;
  hline(doc, ML + titleW, y - 2.5, CW - titleW, SLATE, 0.4);
  return y + 5;
}

// ── CAPA ──────────────────────────────────────────────────────────────────────
function drawCover(doc: jsPDF, r: VmProposalData) {
  // Fundo navy
  fillRect(doc, 0, 0, PW, PH, NAVY);

  // Logo branca
  try {
    doc.addImage(DELTA7_LOGO_WHITE_SMALL, 'JPEG', ML, 12, 36, 11);
  } catch {
    t(doc, 'Delta7', ML, 26, { size: 22, style: 'bold', color: WHITE });
  }

  t(doc, 'DELTA7 TECNOLOGIA', ML + CW, 20, { size: 7, color: [148, 163, 184] as any, align: 'right' });

  // Linha decorativa laranja
  fillRect(doc, ML, 80, 20, 1.5, ORANGE);

  // Tag
  t(doc, 'P R O P O S T A   C O M E R C I A L', ML, 90, { size: 8, color: [148, 163, 184] as any });

  // Titulo
  doc.setFontSize(52);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text('LOCACAO', ML, 118);

  doc.setFontSize(52);
  doc.setFont('helvetica', 'bolditalic');
  doc.setTextColor(...ORANGE);
  doc.text('de VMs.', ML, 140);

  t(doc, 'Maquinas virtuais gerenciadas,', ML, 155, { size: 14, color: [203, 213, 225] as any });
  t(doc, 'infraestrutura dedicada Delta7.', ML, 162, { size: 14, color: [203, 213, 225] as any });

  // Rodape da capa
  hline(doc, ML, PH - 38, CW, [30, 58, 110] as any, 0.5);

  t(doc, 'PREPARADO PARA', ML, PH - 31, { size: 7, color: [148, 163, 184] as any });
  t(doc, r.clientName, ML, PH - 25, { size: 12, style: 'bold', color: WHITE });
  t(doc, `Proposta N\u00ba ${r.proposalNumber}`, ML, PH - 19, { size: 9, color: [185, 194, 214] as any });

  t(doc, 'EMITIDA EM', ML + CW, PH - 31, { size: 7, color: [148, 163, 184] as any, align: 'right' });
  t(doc, fmtDate(r.generatedAt), ML + CW, PH - 25, { size: 12, style: 'bold', color: WHITE, align: 'right' });
  t(doc, `Validade: ${r.validityDays} dias`, ML + CW, PH - 19, { size: 9, color: [185, 194, 214] as any, align: 'right' });
}

// ── IDENTIFICACAO + VMs ───────────────────────────────────────────────────────
function drawIdentificacaoVms(doc: jsPDF, r: VmProposalData) {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber);
  let y = 28;

  // Identificacao do cliente
  y = sectionTitle(doc, 'Cliente', 'Identificacao do Cliente', y);

  const infoRows = [
    ['Razao Social', r.clientName, '', ''],
    ['CNPJ / CPF', r.clientDocument || '-', 'Contato', r.clientContact || '-'],
    ['E-mail', r.clientEmail || '-', 'Executivo', r.salesRepName],
  ];
  y = drawInfoTable(doc, infoRows, y);
  y += 8;

  // Ambiente Virtual
  y = sectionTitle(doc, 'Infraestrutura', 'Ambiente Virtual Provisionado', y);

  const vmsValidas = filterVms(r.vms);

  // Cabecalho da tabela
  const vmCols = [
    { label: 'VM',       w: CW * 0.18 },
    { label: 'FUNCAO',   w: CW * 0.26 },
    { label: 'vCPUs',    w: CW * 0.09 },
    { label: 'RAM',      w: CW * 0.10 },
    { label: 'STORAGE',  w: CW * 0.20 },
    { label: 'SISTEMA',  w: CW * 0.17 },
  ];
  const vmRowH = 8;

  fillRect(doc, ML, y, CW, vmRowH, NAVY);
  let cx = ML + 3;
  vmCols.forEach((col) => {
    t(doc, col.label, cx, y + 5.5, { size: 7.5, style: 'bold', color: WHITE });
    cx += col.w;
  });
  y += vmRowH;

  vmsValidas.forEach((vm, idx) => {
    const bg = idx % 2 === 0 ? WHITE : PAPER;
    fillRect(doc, ML, y, CW, vmRowH, bg);
    cx = ML + 3;
    const vals = [
      truncate(doc, vm.nome || '-',    vmCols[0].w - 4),
      truncate(doc, vm.funcao || '-',  vmCols[1].w - 4),
      String(vm.vcpus || 0),
      vm.ram     || '-',
      truncate(doc, vm.storage || '-', vmCols[4].w - 4),
      truncate(doc, vm.so || '-',      vmCols[5].w - 4),
    ];
    vals.forEach((val, ci) => {
      t(doc, val, cx, y + 5.5, { size: 8, color: INK });
      cx += vmCols[ci].w;
    });
    hline(doc, ML, y + vmRowH, CW, BORDER, 0.2);
    y += vmRowH;
  });

  // Linha de total
  const totalVcpus = vmsValidas.reduce((s, v) => s + (Number(v.vcpus) || 0), 0);
  fillRect(doc, ML, y, CW, vmRowH, CREAM);
  fillRect(doc, ML, y, 3, vmRowH, ORANGE);
  t(doc, 'TOTAL', ML + 6, y + 5.5, { size: 8, style: 'bold', color: NAVY });
  t(doc, `${totalVcpus} vCPUs`, ML + vmCols[0].w + vmCols[1].w + 3, y + 5.5, { size: 8, style: 'bold', color: ORANGE2 });
  hline(doc, ML, y + vmRowH, CW, BORDER, 0.3);
  y += vmRowH + 4;

  // Nota
  t(doc, '* Infraestrutura hospedada em servidor dedicado com Proxmox VE, operado e gerenciado pela Delta7 Tecnologia.', ML, y, { size: 7, style: 'italic', color: MUTED, maxWidth: CW });
  t(doc, '  Licencas Windows Server 2022 Standard incluidas nos planos.', ML, y + 4, { size: 7, style: 'italic', color: MUTED });
  y += 12;

  // O que esta incluido
  y = sectionTitle(doc, 'Servicos', 'O que esta incluido', y);

  const incluidos = [
    ['VMs provisionadas e configuradas pela Delta7',     'Suporte tecnico incluso - equipe Delta7'],
    ['Licencas Windows Server 2022 (VMs Windows)',       'Monitoramento proativo de disponibilidade'],
    ['Snapshots e backup periodico do ambiente virtual', 'Atualizacoes e manutencao do hypervisor Proxmox'],
    ['Isolamento de rede entre VMs (seguranca)',         'Escalabilidade - recursos ampliados sob demanda'],
  ];

  incluidos.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? PAPER : WHITE;
    fillRect(doc, ML, y, CW, 7, bg);
    // Marcador laranja
    fillRect(doc, ML, y, 2.5, 7, ORANGE);
    t(doc, row[0], ML + 6, y + 5, { size: 8, color: INK });
    fillRect(doc, ML + CW / 2, y, 2.5, 7, ORANGE);
    t(doc, row[1], ML + CW / 2 + 6, y + 5, { size: 8, color: INK });
    hline(doc, ML, y + 7, CW, BORDER, 0.2);
    y += 7;
  });
}

// ── INVESTIMENTO + CONDICOES ──────────────────────────────────────────────────
function drawInvestimentoCondicoes(doc: jsPDF, r: VmProposalData) {
  doc.addPage();
  drawPageHeader(doc, r.proposalNumber);
  let y = 28;

  const vmsValidas = filterVms(r.vms);

  // Planos
  y = sectionTitle(doc, 'Investimento', 'Planos de Contratacao', y);

  const planoW = CW / r.planos.length;
  const planoH = 32;

  r.planos.forEach((plano, idx) => {
    const px    = ML + idx * planoW;
    const isAlt = idx % 2 === 1;
    const bgHdr = isAlt ? ORANGE  : NAVY;
    const bgBdy = isAlt ? ORANGE2 : CREAM;
    const priceColor = isAlt ? (WHITE as [number,number,number]) : (ORANGE as [number,number,number]);
    const labelColor = isAlt ? ([255,220,180] as [number,number,number]) : (MUTED as [number,number,number]);

    // Header
    fillRect(doc, px, y, planoW - 1, 10, bgHdr);
    t(doc, plano.prazo, px + (planoW - 1) / 2, y + 7, { size: 11, style: 'bold', color: WHITE, align: 'center' });

    // Body
    fillRect(doc, px, y + 10, planoW - 1, planoH - 10, bgBdy);
    t(doc, formatBRL(plano.mensal), px + (planoW - 1) / 2, y + 23, { size: 17, style: 'bold', color: priceColor, align: 'center' });
    t(doc, '/mes', px + (planoW - 1) / 2, y + 28, { size: 7, color: labelColor, align: 'center' });
    t(doc, `${vmsValidas.length} VM(s) gerenciadas`, px + (planoW - 1) / 2, y + 32, { size: 7, color: labelColor, align: 'center' });

    // Borda
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.rect(px, y, planoW - 1, planoH);
  });
  y += planoH + 6;

  // Taxa de ativacao
  if (r.activationFee > 0) {
    fillRect(doc, ML, y, CW, 8, PAPER);
    fillRect(doc, ML, y, 3, 8, SLATE);
    t(doc, `Taxa de ativacao / implantacao: ${formatBRL(r.activationFee)} — cobrada uma unica vez.`, ML + 6, y + 5.5, { size: 8, style: 'italic', color: MUTED });
    y += 12;
  }

  // Observacoes
  if (r.notes) {
    y = sectionTitle(doc, 'Informacoes', 'Observacoes', y);
    fillRect(doc, ML, y, 3, 14, NAVY);
    fillRect(doc, ML, y, CW, 14, PAPER);
    const notesLines = doc.splitTextToSize(r.notes, CW - 10);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...MUTED);
    doc.text(notesLines.slice(0, 3), ML + 6, y + 6);
    y += 18;
  }

  // Condicoes comerciais
  y = sectionTitle(doc, 'Contrato', 'Condicoes Comerciais', y);

  const conds = [
    'Pagamento mensal via boleto ou PIX, com vencimento no dia 10 de cada mes.',
    'Multa de 20% sobre o valor das parcelas restantes em caso de rescisao antecipada.',
    'Reajuste anual pelo IGPM ou indice acordado entre as partes.',
    'A infraestrutura fisica permanece sob propriedade e gestao da Delta7 Tecnologia.',
    'Recursos adicionais de CPU, RAM ou storage podem ser contratados separadamente.',
    'Em caso de dano causado por uso indevido das VMs, o cliente arcara com os custos de restauracao.',
    `Proposta valida por ${r.validityDays} dias a partir da data de emissao.`,
  ];

  conds.forEach((c, idx) => {
    const bg = idx % 2 === 0 ? WHITE : PAPER;
    fillRect(doc, ML, y, CW, 7, bg);
    hline(doc, ML, y, CW, BORDER, 0.2);
    // Bullet laranja
    fillRect(doc, ML + 3, y + 2.8, 1.5, 1.5, ORANGE);
    t(doc, c, ML + 8, y + 5, { size: 8, color: INK, maxWidth: CW - 10 });
    y += 7;
  });
  hline(doc, ML, y, CW, BORDER, 0.3);
  y += 10;

  // Assinaturas
  y = sectionTitle(doc, 'Formalizacao', 'Aceite da Proposta', y);

  t(doc, `Declaro estar de acordo com os termos, valores e condicoes apresentados nesta proposta`, ML, y, { size: 8.5, color: MUTED });
  y += 4.5;
  t(doc, `comercial, emitida em ${fmtDate(r.generatedAt)} com validade de ${r.validityDays} dias.`, ML, y, { size: 8.5, color: MUTED });
  y += 16;

  const assW = CW * 0.42;
  hline(doc, ML, y, assW, NAVY, 0.5);
  hline(doc, ML + CW - assW, y, assW, NAVY, 0.5);
  y += 5;
  t(doc, r.clientName.toUpperCase(), ML + assW / 2, y, { size: 9, style: 'bold', color: NAVY, align: 'center' });
  t(doc, 'DELTA7 TECNOLOGIA', ML + CW - assW / 2, y, { size: 9, style: 'bold', color: NAVY, align: 'center' });
  y += 4.5;
  t(doc, 'CLIENTE', ML + assW / 2, y, { size: 7, color: MUTED, align: 'center' });
  t(doc, r.salesRepName.toUpperCase(), ML + CW - assW / 2, y, { size: 7, color: MUTED, align: 'center' });
  y += 12;

  // Hash de integridade
  fillRect(doc, ML, y, CW, 16, PAPER);
  doc.setDrawColor(...BORDER);
  doc.setLineWidth(0.3);
  doc.rect(ML, y, CW, 16);
  t(doc, 'HASH DE LEGITIMIDADE SHA-256', ML + 4, y + 5, { size: 7, style: 'bold', color: MUTED });
  doc.setFontSize(6.5);
  doc.setFont('courier', 'normal');
  doc.setTextColor(...NAVY);
  doc.text(r.integrityHash, ML + 4, y + 10);
  t(doc, 'Documento emitido eletronicamente pela plataforma Delta7.', ML + 4, y + 14, { size: 6, style: 'italic', color: MUTED });
  y += 20;

  // Rodape
  hline(doc, ML, PH - 14, CW, BORDER, 0.3);
  fillRect(doc, ML, PH - 14, CW, 1, ORANGE);
  t(doc, 'Delta7 Tecnologia - Solucoes em Tecnologia  |  contato@delta7.com.br  |  www.delta7.com.br', PW / 2, PH - 9, { size: 7, color: MUTED, align: 'center' });
  t(doc, 'Este documento e de carater confidencial e destinado exclusivamente ao cliente indicado.', PW / 2, PH - 5, { size: 6, style: 'italic', color: MUTED, align: 'center' });
}

// ── tabela info ───────────────────────────────────────────────────────────────
function drawInfoTable(doc: jsPDF, rows: string[][], y: number): number {
  const rowH = 8;
  const col1W = CW * 0.22;
  const col2W = CW * 0.28;
  const col3W = CW * 0.20;
  const col4W = CW * 0.30;

  for (let ri = 0; ri < rows.length; ri++) {
    const [l1, v1, l2, v2] = rows[ri];

    fillRect(doc, ML, y, col1W, rowH, CREAM);
    t(doc, l1, ML + 2, y + 5.5, { size: 8.5, style: 'bold', color: NAVY });
    t(doc, truncate(doc, v1, (l2 ? col2W : col2W + col3W + col4W) - 4), ML + col1W + 2, y + 5.5, { size: 8.5, color: INK });

    if (l2) {
      fillRect(doc, ML + col1W + col2W, y, col3W, rowH, CREAM);
      t(doc, l2, ML + col1W + col2W + 2, y + 5.5, { size: 8.5, style: 'bold', color: NAVY });
      t(doc, truncate(doc, v2, col4W - 4), ML + col1W + col2W + col3W + 2, y + 5.5, { size: 8.5, color: INK });
    }

    hline(doc, ML, y + rowH, CW, BORDER, 0.3);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.line(ML, y, ML, y + rowH);
    doc.line(ML + CW, y, ML + CW, y + rowH);
    y += rowH;
  }
  hline(doc, ML, y - rows.length * rowH, CW, BORDER, 0.3);
  return y;
}

// ── Builder principal ─────────────────────────────────────────────────────────
const yieldToUI = () => new Promise<void>(resolve => setTimeout(resolve, 0));

async function buildVmProposalPdf(data: VmProposalData): Promise<jsPDF> {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

  // Pagina 1 — Capa
  drawCover(doc, data);
  await yieldToUI();

  // Pagina 2 — Identificacao + VMs + Incluidos
  drawIdentificacaoVms(doc, data);
  await yieldToUI();

  // Pagina 3 — Planos + Condicoes + Aceite
  drawInvestimentoCondicoes(doc, data);

  return doc;
}

// ── Exports publicos ──────────────────────────────────────────────────────────
export async function downloadVmProposalPdf(data: VmProposalData): Promise<void> {
  const doc = await buildVmProposalPdf(data);
  const filename = `Proposta_VM_${data.clientName.replace(/\s+/g, '_')}_${data.proposalNumber}.pdf`;
  try {
    const blob = doc.output('blob') as Blob;
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    a.rel      = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 4000);
  } catch {
    doc.save(filename);
  }
}

export async function previewVmProposalPdf(data: VmProposalData): Promise<string[]> {
  const doc = await buildVmProposalPdf(data);
  const dataUri = doc.output('datauristring');
  return [dataUri];
}
