// src/utils/vmProposalPdf.ts
// Engine jsPDF para Proposta de Locacao de VMs — Delta7 Tecnologia
// Segue o mesmo padrao do commercialProposalPdfModelo03.ts

import jsPDF from 'jspdf';

// ── Tipos ─────────────────────────────────────────────────────────────────────

export interface VmItem {
  nome: string;       // ex: "VM 1 — Active Directory"
  funcao: string;     // ex: "Controlador de Dominio"
  vcpus: number;
  ram: string;        // ex: "4 GB"
  storage: string;    // ex: "80 GB SSD"
  so: string;         // ex: "Windows Server 2022"
}

export interface VmPlano {
  prazo: string;      // ex: "12 MESES"
  mensal: number;     // valor numerico
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

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR');

// Quebra texto em linhas respeitando largura maxima (em mm convertido p/ chars aprox)
const splitLines = (doc: jsPDF, text: string, maxWidth: number): string[] =>
  doc.splitTextToSize(text, maxWidth);

// ── Cores Delta7 ──────────────────────────────────────────────────────────────
const COR = {
  laranja:    [232, 119, 34]  as [number, number, number],
  laranjaEsc: [192,  90,  0]  as [number, number, number],
  cinzaEsc:   [ 44,  44, 44]  as [number, number, number],
  cinzaClaro: [244, 246, 249] as [number, number, number],
  cinzaBd:    [208, 215, 226] as [number, number, number],
  branco:     [255, 255, 255] as [number, number, number],
  verde:      [ 30, 126,  52] as [number, number, number],
  texto:      [ 44,  44, 44]  as [number, number, number],
  cinzaMed:   [120, 120, 120] as [number, number, number],
};

// ── Builder principal ─────────────────────────────────────────────────────────

function buildVmProposalPdf(data: VmProposalData): jsPDF {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  const W = 210;
  const ML = 14; // margin left
  const MR = 14; // margin right
  const CW = W - ML - MR; // content width
  let y = 0;

  const setFill  = (c: [number,number,number]) => doc.setFillColor(...c);
  const setDraw  = (c: [number,number,number]) => doc.setDrawColor(...c);
  const setTxt   = (c: [number,number,number]) => doc.setTextColor(...c);
  const setFont  = (style: 'normal'|'bold', size: number) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
  };

  // ── CABEÇALHO ───────────────────────────────────────────────────────────────
  // Faixa laranja no topo
  setFill(COR.laranja);
  doc.rect(0, 0, W, 28, 'F');

  // Logo texto "Delta7" (substituir por image se tiver base64)
  setFont('bold', 18);
  setTxt(COR.branco);
  doc.text('Delta7 Tecnologia', ML, 12);
  setFont('normal', 8);
  doc.text('Solucoes em Tecnologia', ML, 17);

  // Titulo proposta (lado direito)
  setFont('bold', 11);
  doc.text('PROPOSTA COMERCIAL', W - MR, 10, { align: 'right' });
  setFont('normal', 8);
  doc.text('Locacao de Maquinas Virtuais Gerenciadas', W - MR, 15, { align: 'right' });
  doc.text(`N° ${data.proposalNumber}  |  ${formatDate(data.generatedAt)}`, W - MR, 20, { align: 'right' });

  // Linha divisoria laranja escura
  setFill(COR.laranjaEsc);
  doc.rect(0, 28, W, 1.5, 'F');

  y = 35;

  // ── IDENTIFICACAO ──────────────────────────────────────────────────────────
  const drawInfoRow = (label: string, value: string, x: number, yy: number, colW: number) => {
    setFont('bold', 7);
    setTxt(COR.laranja);
    doc.text(label, x, yy);
    setFont('normal', 9);
    setTxt(COR.texto);
    doc.text(splitLines(doc, value, colW - 2), x, yy + 4);
  };

  const colW2 = CW / 2;
  drawInfoRow('CLIENTE',    data.clientName,                   ML,           y,      colW2);
  drawInfoRow('DOCUMENTO',  data.clientDocument || '—',        ML + colW2,   y,      colW2);
  y += 12;
  drawInfoRow('CONTATO',    data.clientContact  || '—',        ML,           y,      colW2);
  drawInfoRow('E-MAIL',     data.clientEmail    || '—',        ML + colW2,   y,      colW2);
  y += 12;
  drawInfoRow('EXECUTIVO',  data.salesRepName,                 ML,           y,      colW2);
  drawInfoRow('VALIDADE',   `${data.validityDays} dias`,       ML + colW2,   y,      colW2);
  y += 10;

  // Linha separadora
  setDraw(COR.cinzaBd);
  doc.setLineWidth(0.3);
  doc.line(ML, y, W - MR, y);
  y += 6;

  // ── AMBIENTE VIRTUAL ───────────────────────────────────────────────────────
  setFont('bold', 11);
  setTxt(COR.cinzaEsc);
  doc.text('Ambiente Virtual Provisionado', ML, y);
  y += 2;
  setFill(COR.laranja);
  doc.rect(ML, y, CW, 1.2, 'F');
  y += 5;

  // Cabecalho da tabela de VMs
  const vmCols = [
    { label: 'VM',        w: 22 },
    { label: 'FUNCAO',    w: 42 },
    { label: 'vCPUs',     w: 16 },
    { label: 'RAM',       w: 18 },
    { label: 'STORAGE',   w: 38 },
    { label: 'SISTEMA',   w: 46 },
  ];
  const vmRowH = 8;

  // Header row
  setFill(COR.cinzaEsc);
  doc.rect(ML, y, CW, vmRowH, 'F');
  setFont('bold', 7.5);
  setTxt(COR.branco);
  let cx = ML + 2;
  vmCols.forEach((col) => {
    doc.text(col.label, cx, y + 5.5);
    cx += col.w;
  });
  y += vmRowH;

  // Linhas de VMs
  data.vms.forEach((vm, idx) => {
    const bg = idx % 2 === 0 ? COR.cinzaClaro : COR.branco;
    setFill(bg);
    doc.rect(ML, y, CW, vmRowH, 'F');
    setFont('normal', 8);
    setTxt(COR.texto);
    cx = ML + 2;
    const vals = [vm.nome, vm.funcao, String(vm.vcpus), vm.ram, vm.storage, vm.so];
    vmCols.forEach((col, ci) => {
      const txt = splitLines(doc, vals[ci], col.w - 2)[0] || vals[ci];
      doc.text(txt, cx, y + 5.5);
      cx += col.w;
    });
    y += vmRowH;
  });

  // Linha total
  setFill([255, 243, 232]);
  doc.rect(ML, y, CW, vmRowH, 'F');
  setFont('bold', 8);
  setTxt(COR.laranjaEsc);
  const totalVcpus = data.vms.reduce((s, v) => s + v.vcpus, 0);
  doc.text('TOTAL', ML + 2, y + 5.5);
  cx = ML + 2 + vmCols[0].w + vmCols[1].w;
  doc.text(String(totalVcpus) + ' vCPUs', cx, y + 5.5);
  y += vmRowH + 3;

  // Nota discos cliente
  setFont('normal', 7);
  setTxt(COR.cinzaMed);
  const nota = '* Infraestrutura hospedada em servidor dedicado Dell PowerEdge R630 com Proxmox VE, operado e gerenciado pela Delta7 Tecnologia. Licencas Windows Server 2022 Standard incluidas nos planos.';
  doc.text(splitLines(doc, nota, CW), ML, y);
  y += 10;

  // ── PLANOS DE CONTRATACAO ─────────────────────────────────────────────────
  setFont('bold', 11);
  setTxt(COR.cinzaEsc);
  doc.text('Planos de Contratacao', ML, y);
  y += 2;
  setFill(COR.laranja);
  doc.rect(ML, y, CW, 1.2, 'F');
  y += 6;

  const planoW  = CW / data.planos.length;
  const planoH  = 28;

  data.planos.forEach((plano, idx) => {
    const px    = ML + idx * planoW;
    const isAlt = idx % 2 === 1;
    const bgHdr = isAlt ? COR.laranja : COR.cinzaEsc;
    const bgBdy = isAlt ? ([201, 90, 0] as [number,number,number]) : COR.cinzaClaro;
    const txtPrx = isAlt ? COR.branco : COR.laranja;

    // Header do card
    setFill(bgHdr);
    doc.rect(px, y, planoW - 1, 9, 'F');
    setFont('bold', 10);
    setTxt(COR.branco);
    doc.text(plano.prazo, px + planoW / 2 - 0.5, y + 6, { align: 'center' });

    // Body do card
    setFill(bgBdy);
    doc.rect(px, y + 9, planoW - 1, planoH - 9, 'F');
    setFont('bold', 16);
    setTxt(txtPrx);
    doc.text(formatBRL(plano.mensal), px + planoW / 2 - 0.5, y + 21, { align: 'center' });
    setFont('normal', 7);
    setTxt(isAlt ? ([255, 220, 180] as [number,number,number]) : COR.cinzaMed);
    doc.text('/mes', px + planoW / 2 - 0.5, y + 26, { align: 'center' });
    setFont('normal', 7);
    doc.text('3 VMs gerenciadas', px + planoW / 2 - 0.5, y + 30, { align: 'center' });

    // Borda
    setDraw(COR.cinzaBd);
    doc.setLineWidth(0.3);
    doc.rect(px, y, planoW - 1, planoH, 'S');
  });

  y += planoH + 6;

  // Taxa de ativacao
  if (data.activationFee > 0) {
    setFont('normal', 8);
    setTxt(COR.cinzaMed);
    doc.text(`* Taxa de ativacao / implantacao: ${formatBRL(data.activationFee)} (cobrada uma unica vez)`, ML, y);
    y += 7;
  }

  // ── O QUE ESTA INCLUIDO ───────────────────────────────────────────────────
  setFont('bold', 11);
  setTxt(COR.cinzaEsc);
  doc.text('O que esta incluido', ML, y);
  y += 2;
  setFill(COR.laranja);
  doc.rect(ML, y, CW, 1.2, 'F');
  y += 5;

  const incluidos = [
    ['VMs provisionadas e configuradas pela Delta7',     'Suporte tecnico incluso — equipe Delta7'],
    ['Licencas Windows Server 2022 (VMs Windows)',       'Monitoramento proativo de disponibilidade'],
    ['Snapshots e backup periodico do ambiente virtual', 'Atualizacoes e manutencao do hypervisor Proxmox'],
    ['Isolamento de rede entre VMs (seguranca)',         'Escalabilidade — recursos ampliados sob demanda'],
  ];

  incluidos.forEach((row, idx) => {
    const bg = idx % 2 === 0 ? COR.cinzaClaro : COR.branco;
    setFill(bg);
    doc.rect(ML, y, CW, 7, 'F');
    setFont('normal', 8);
    setTxt(COR.verde);
    doc.text('✓', ML + 2, y + 5);
    setTxt(COR.texto);
    doc.text(row[0], ML + 7, y + 5);
    setTxt(COR.verde);
    doc.text('✓', ML + CW / 2 + 2, y + 5);
    setTxt(COR.texto);
    doc.text(row[1], ML + CW / 2 + 7, y + 5);
    y += 7;
  });
  y += 4;

  // ── CONDICOES COMERCIAIS ──────────────────────────────────────────────────
  setFill(COR.cinzaEsc);
  doc.rect(ML, y, CW, 8, 'F');
  setFont('bold', 8.5);
  setTxt(COR.branco);
  doc.text('  Condicoes Comerciais', ML + 2, y + 5.5);
  y += 8;

  const conds = [
    'Pagamento mensal via boleto ou PIX, com vencimento no dia 10 de cada mes.',
    'Multa de 20% sobre o valor das parcelas restantes em caso de rescisao antecipada.',
    'Reajuste anual pelo IGPM ou indice acordado entre as partes.',
    'A infraestrutura fisica permanece sob propriedade e gestao da Delta7 Tecnologia.',
    'Recursos adicionais de CPU, RAM ou storage podem ser contratados separadamente.',
    'Em caso de dano causado por uso indevido das VMs, o cliente arcara com os custos de restauracao.',
    'Proposta valida por ' + data.validityDays + ' dias a partir da data de emissao.',
  ];

  conds.forEach((c, idx) => {
    const bg = idx % 2 === 0 ? COR.branco : COR.cinzaClaro;
    setFill(bg);
    doc.rect(ML, y, CW, 6, 'F');
    setFont('normal', 7.5);
    setTxt(COR.texto);
    doc.text('• ' + c, ML + 3, y + 4.2);
    y += 6;
  });
  y += 5;

  // ── OBSERVACOES ───────────────────────────────────────────────────────────
  if (data.notes) {
    setFont('bold', 9);
    setTxt(COR.cinzaEsc);
    doc.text('Observacoes', ML, y);
    y += 4;
    setFont('normal', 8);
    setTxt(COR.texto);
    doc.text(splitLines(doc, data.notes, CW), ML, y);
    y += 10;
  }

  // ── ASSINATURAS ───────────────────────────────────────────────────────────
  const assW = CW / 2 - 5;
  const assY = y;

  // Delta7
  setDraw(COR.cinzaBd);
  doc.setLineWidth(0.4);
  doc.line(ML, assY + 10, ML + assW, assY + 10);
  setFont('bold', 8);
  setTxt(COR.cinzaEsc);
  doc.text('DELTA7 TECNOLOGIA', ML + assW / 2, assY + 14, { align: 'center' });
  setFont('normal', 7);
  setTxt(COR.cinzaMed);
  doc.text('Representante Legal', ML + assW / 2, assY + 18, { align: 'center' });
  doc.text(formatDate(data.generatedAt), ML + assW / 2, assY + 22, { align: 'center' });

  // Cliente
  const cx2 = ML + CW / 2 + 5;
  doc.line(cx2, assY + 10, cx2 + assW, assY + 10);
  setFont('bold', 8);
  setTxt(COR.cinzaEsc);
  doc.text(data.clientName.toUpperCase().slice(0, 30), cx2 + assW / 2, assY + 14, { align: 'center' });
  setFont('normal', 7);
  setTxt(COR.cinzaMed);
  doc.text('Representante Legal', cx2 + assW / 2, assY + 18, { align: 'center' });
  doc.text('____/____/________', cx2 + assW / 2, assY + 22, { align: 'center' });

  y = assY + 28;

  // ── RODAPE ────────────────────────────────────────────────────────────────
  setFill(COR.laranja);
  doc.rect(0, y, W, 1.5, 'F');
  y += 4;
  setFont('normal', 7);
  setTxt(COR.cinzaMed);
  doc.text(
    'Delta7 Tecnologia — Solucoes em Tecnologia  |  contato@delta7.com.br  |  www.delta7.com.br',
    W / 2, y, { align: 'center' }
  );
  y += 4;
  doc.text(
    'Este documento e de carater confidencial e destinado exclusivamente ao cliente indicado.',
    W / 2, y, { align: 'center' }
  );
  y += 4;
  setFont('normal', 6);
  setTxt([180, 180, 180] as any);
  doc.text(`Hash: ${data.integrityHash.slice(0, 32)}...`, W / 2, y, { align: 'center' });

  return doc;
}

// ── Exports públicos ──────────────────────────────────────────────────────────

export async function downloadVmProposalPdf(data: VmProposalData): Promise<void> {
  const doc = buildVmProposalPdf(data);
  doc.save(`Proposta_VM_${data.clientName.replace(/\s+/g, '_')}_${data.proposalNumber}.pdf`);
}

export async function previewVmProposalPdf(data: VmProposalData): Promise<string[]> {
  const doc = buildVmProposalPdf(data);
  const blob = doc.output('bloburl');
  return [blob as unknown as string];
}
