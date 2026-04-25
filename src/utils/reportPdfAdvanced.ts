import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  narrateHardware,
  narrateSO,
  narrateOffice,
  narrateAntivirus,
  narrateEstadoVisual,
  narrateParecer,
  narrateCriticidade,
  type SituacaoHW,
} from './reportNarrativeAdvanced';
import {
  PAGE, contentWidth,
  PdfCursor, drawHeader, drawFooters,
  drawSectionTitle, drawParagraph, drawCallout,
  drawPhotoGrid, drawHashFooter, fmtDate,
  type HeaderInfo,
} from './pdfHelpers';

export interface AdvancedPhoto {
  dataUrl: string;
  caption: string;
  external?: boolean;
  externalUrl?: string;
  externalProvider?: string;
}

export interface AdvancedReportData {
  reportNumber: string;
  generatedAt: string;
  technicianName: string;
  patrimonio: string;
  marca: string;
  modelo: string;
  tipo: string;
  setor: string;
  unidade: string;
  usuario: string;
  contato: string;
  dataAquisicao: string;
  garantia: string;
  finalidades: string[];
  finalidadeOutro: string;
  hardware: Array<{ componente: string; descricao: string; situacao: SituacaoHW; obs?: string }>;
  software: {
    so: { descricao: string; situacao: string; obs: string };
    office: { descricao: string; situacao: string; obs: string };
    antivirus: { descricao: string; situacao: string; obs: string };
    especifico: { descricao: string; situacao: string; obs: string };
    drivers: { descricao: string; situacao: string; obs: string };
  };
  problemas: Array<{ area: string; descricao: string; criticidade: string; acao: string }>;
  estado: {
    conservacao: string;
    desempenho: string;
    seguranca: string;
    conectividade: string;
  };
  parecer: string;
  parecerTexto: string;
  recomendacoes: Array<{ texto: string; responsavel: string; prazo: string }>;
  photos: AdvancedPhoto[];
  observacoesFinais: string;
  assinaturaTecnico: string;
  assinaturaGestor: string;
  assinaturaUsuario: string;
  gestorNome: string;
  gestorCargo: string;
  usuarioNome: string;
  usuarioMatricula: string;
  integrityHash: string;
}

const NAVY: [number, number, number] = [30, 58, 138];
const GRAY_BG: [number, number, number] = [241, 245, 249];
const TEXT: [number, number, number] = [30, 41, 59];

function tableTheme(extra: Partial<Parameters<typeof autoTable>[1]> = {}) {
  return {
    theme: 'grid' as const,
    headStyles: { fillColor: NAVY, textColor: 255, fontStyle: 'bold' as const, fontSize: 9 },
    bodyStyles: { fontSize: 9, textColor: TEXT, cellPadding: 2 },
    alternateRowStyles: { fillColor: [250, 251, 253] as [number, number, number] },
    margin: { left: PAGE.marginX, right: PAGE.marginX },
    ...extra,
  };
}

function situacaoColor(s: string): [number, number, number] {
  if (s === 'Bom' || s === 'Original' || s === 'Ativo' || s === 'Licenciado') return [22, 163, 74];
  if (s === 'Regular' || s === 'Expirado' || s === 'Pendentes') return [217, 119, 6];
  if (s === 'Ruim' || s === 'Pirata' || s === 'Sem' || s === 'Com falha') return [220, 38, 38];
  return [100, 116, 139];
}

function criticidadeColor(c: string): [number, number, number] {
  if (c === 'Alta') return [220, 38, 38];
  if (c === 'Média') return [217, 119, 6];
  if (c === 'Baixa') return [22, 163, 74];
  return [100, 116, 139];
}

function parecerInfo(p: string): { label: string; color: [number, number, number] } {
  if (p === 'ADEQUADO') return { label: 'ADEQUADO PARA USO', color: [22, 163, 74] };
  if (p === 'ADEQUADO_RESSALVAS') return { label: 'ADEQUADO COM RESSALVAS', color: [217, 119, 6] };
  if (p === 'INADEQUADO') return { label: 'INADEQUADO PARA USO', color: [220, 38, 38] };
  if (p === 'CONDENADO') return { label: 'CONDENADO', color: [127, 29, 29] };
  return { label: '—', color: [100, 116, 139] };
}

function syncCursorAfterTable(c: PdfCursor) {
  // autotable manipula a página atual; sincronizamos cursor + página
  const pdf = c.pdf;
  const last = (pdf as any).lastAutoTable;
  if (last) {
    // Se autotable mudou de página, segue na última
    const totalPages = pdf.getNumberOfPages();
    pdf.setPage(totalPages);
    c.y = last.finalY + 4;
  }
}

export async function generateAdvancedReportPdf(r: AdvancedReportData): Promise<jsPDF> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const header: HeaderInfo = {
    title: 'DELTA7 SOLUÇÕES EM TECNOLOGIA',
    subtitle: 'LAUDO TÉCNICO DE EQUIPAMENTO — Computador / Estação de Trabalho',
    reportNumber: r.reportNumber,
    generatedAt: r.generatedAt,
  };
  drawHeader(pdf, header);
  const c = new PdfCursor(pdf, header);

  // ============ 1. IDENTIFICAÇÃO ============
  drawSectionTitle(c, '1', 'IDENTIFICAÇÃO DO EQUIPAMENTO');
  autoTable(pdf, tableTheme({
    startY: c.y,
    body: [
      [{ content: 'Patrimônio / Nº de Série', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.patrimonio || '—',
       { content: 'Marca', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.marca || '—'],
      [{ content: 'Modelo', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.modelo || '—',
       { content: 'Tipo', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.tipo || '—'],
      [{ content: 'Setor / Departamento', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.setor || '—',
       { content: 'Unidade', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.unidade || '—'],
      [{ content: 'Usuário Responsável', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.usuario || '—',
       { content: 'Ramal / Contato', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.contato || '—'],
      [{ content: 'Data de Aquisição', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, fmtDate(r.dataAquisicao),
       { content: 'Garantia vigente?', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, r.garantia || '—'],
    ],
    columnStyles: {
      0: { cellWidth: contentWidth * 0.22 },
      1: { cellWidth: contentWidth * 0.28 },
      2: { cellWidth: contentWidth * 0.22 },
      3: { cellWidth: contentWidth * 0.28 },
    },
    didDrawPage: () => drawHeader(pdf, header),
  }));
  syncCursorAfterTable(c);

  // ============ 2. FINALIDADE ============
  drawSectionTitle(c, '2', 'FINALIDADE PRINCIPAL DO EQUIPAMENTO');
  const finalidades = [
    ...r.finalidades,
    r.finalidadeOutro ? `Outro: ${r.finalidadeOutro}` : '',
  ].filter(Boolean).join(' · ') || '—';
  drawCallout(c, finalidades);

  // ============ 3. HARDWARE ============
  drawSectionTitle(c, '3', 'INSPEÇÃO DE HARDWARE');
  const hwRows = r.hardware
    .filter((h) => h.descricao || h.situacao)
    .map((h) => [
      h.componente,
      h.descricao || '—',
      { content: h.situacao || '—', styles: { halign: 'center' as const, textColor: situacaoColor(h.situacao), fontStyle: 'bold' as const } },
      h.obs || '',
    ]);
  autoTable(pdf, tableTheme({
    startY: c.y,
    head: [['Componente', 'Descrição', 'Situação', 'Observações']],
    body: hwRows.length ? hwRows : [[{ content: 'Sem componentes informados.', colSpan: 4, styles: { halign: 'center' as const, textColor: [148, 163, 184] as [number, number, number] } }]],
    columnStyles: {
      0: { cellWidth: contentWidth * 0.22, fontStyle: 'bold' },
      1: { cellWidth: contentWidth * 0.40 },
      2: { cellWidth: contentWidth * 0.13, halign: 'center' },
      3: { cellWidth: contentWidth * 0.25, fontSize: 8 },
    },
    didDrawPage: () => drawHeader(pdf, header),
  }));
  syncCursorAfterTable(c);

  const hwNarrative = r.hardware
    .filter((h) => h.situacao && h.situacao !== 'Bom')
    .map((h) => narrateHardware(h.componente, h.situacao));
  if (hwNarrative.length) {
    drawParagraph(c, 'Análise narrativa:', { bold: true, color: NAVY, fontSize: 9.5 });
    for (const line of hwNarrative) {
      drawParagraph(c, `• ${line}`, { fontSize: 9.5, indent: 3, lineHeight: 4.2 });
    }
    c.advance(2);
  }

  // ============ 4. SOFTWARE ============
  drawSectionTitle(c, '4', 'CONFIGURAÇÃO DE SOFTWARE');
  const sw = r.software;
  const swRow = (label: string, item: { descricao: string; situacao: string; obs: string }) => [
    label,
    item.descricao || '—',
    { content: item.situacao || '—', styles: { halign: 'center' as const, textColor: situacaoColor(item.situacao), fontStyle: 'bold' as const } },
    item.obs || '',
  ];
  autoTable(pdf, tableTheme({
    startY: c.y,
    head: [['Item', 'Descrição / Versão', 'Situação', 'Observação']],
    body: [
      swRow('Sistema Operacional', sw.so),
      swRow('Pacote Office / Produtividade', sw.office),
      swRow('Antivírus / Segurança', sw.antivirus),
      swRow('Software Específico', sw.especifico),
      swRow('Drivers / Atualizações', sw.drivers),
    ],
    columnStyles: {
      0: { cellWidth: contentWidth * 0.25, fontStyle: 'bold' },
      1: { cellWidth: contentWidth * 0.32 },
      2: { cellWidth: contentWidth * 0.18, halign: 'center' },
      3: { cellWidth: contentWidth * 0.25, fontSize: 8 },
    },
    didDrawPage: () => drawHeader(pdf, header),
  }));
  syncCursorAfterTable(c);

  const swNarrative = [
    narrateSO(sw.so.situacao),
    narrateOffice(sw.office.situacao),
    narrateAntivirus(sw.antivirus.situacao),
  ].filter(Boolean);
  if (swNarrative.length) {
    drawParagraph(c, 'Compliance:', { bold: true, color: NAVY, fontSize: 9.5 });
    for (const line of swNarrative) {
      drawParagraph(c, `• ${line}`, { fontSize: 9.5, indent: 3, lineHeight: 4.2 });
    }
    c.advance(2);
  }

  // ============ 5. PROBLEMAS ============
  drawSectionTitle(c, '5', 'DIAGNÓSTICO DE PROBLEMAS IDENTIFICADOS');
  const problemRows = r.problemas
    .filter((p) => p.descricao)
    .map((p, i) => [
      String(i + 1),
      p.area,
      p.descricao,
      { content: narrateCriticidade(p.criticidade), styles: { halign: 'center' as const, textColor: criticidadeColor(p.criticidade), fontStyle: 'bold' as const, fontSize: 8 } },
      p.acao,
    ]);
  autoTable(pdf, tableTheme({
    startY: c.y,
    head: [['Nº', 'Componente / Área', 'Descrição do Problema', 'Criticidade', 'Ação Recomendada']],
    body: problemRows.length ? problemRows : [[{ content: 'Nenhum problema identificado.', colSpan: 5, styles: { halign: 'center' as const, textColor: [148, 163, 184] as [number, number, number] } }]],
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: contentWidth * 0.18 },
      2: { cellWidth: contentWidth * 0.36 },
      3: { cellWidth: contentWidth * 0.18, halign: 'center' },
      4: { cellWidth: contentWidth * 0.22 },
    },
    didDrawPage: () => drawHeader(pdf, header),
  }));
  syncCursorAfterTable(c);

  // ============ 6. ESTADO GERAL ============
  drawSectionTitle(c, '6', 'ESTADO GERAL DO EQUIPAMENTO');
  autoTable(pdf, tableTheme({
    startY: c.y,
    head: [['Conservação', 'Desempenho', 'Segurança', 'Conectividade']],
    body: [[
      { content: r.estado.conservacao || '—', styles: { halign: 'center' as const, fontStyle: 'bold' as const } },
      { content: r.estado.desempenho || '—', styles: { halign: 'center' as const, fontStyle: 'bold' as const } },
      { content: r.estado.seguranca || '—', styles: { halign: 'center' as const, fontStyle: 'bold' as const } },
      { content: r.estado.conectividade || '—', styles: { halign: 'center' as const, fontStyle: 'bold' as const } },
    ]],
    headStyles: { fillColor: GRAY_BG, textColor: TEXT, fontStyle: 'bold', halign: 'center', fontSize: 9 },
    didDrawPage: () => drawHeader(pdf, header),
  }));
  syncCursorAfterTable(c);

  const estadoNarr = [
    narrateEstadoVisual('Conservação Física', r.estado.conservacao),
    narrateEstadoVisual('Desempenho Operacional', r.estado.desempenho),
    narrateEstadoVisual('Segurança da Informação', r.estado.seguranca),
    narrateEstadoVisual('Conectividade / Rede', r.estado.conectividade),
  ].filter(Boolean);
  for (const line of estadoNarr) {
    drawParagraph(c, `• ${line}`, { fontSize: 9.5, indent: 3, lineHeight: 4.2 });
  }
  c.advance(2);

  // ============ 7. PARECER ============
  drawSectionTitle(c, '7', 'PARECER CONCLUSIVO');
  const par = parecerInfo(r.parecer);
  // Selo centralizado
  c.ensure(14);
  const selW = pdf.getTextWidth(par.label) + 16;
  const selX = (PAGE.width - selW) / 2;
  pdf.setFillColor(...par.color);
  pdf.roundedRect(selX, c.y, selW, 9, 1.5, 1.5, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(11);
  pdf.text(par.label, PAGE.width / 2, c.y + 6, { align: 'center' });
  pdf.setTextColor(...TEXT);
  c.advance(13);

  drawParagraph(c, narrateParecer(r.parecer), { fontSize: 10, lineHeight: 4.4 });
  c.advance(1);
  if (r.parecerTexto) {
    drawParagraph(c, 'Justificativa Técnica:', { bold: true, color: NAVY, fontSize: 9.5 });
    drawCallout(c, r.parecerTexto, { fontSize: 9.5 });
  }

  // ============ 8. RECOMENDAÇÕES ============
  drawSectionTitle(c, '8', 'RECOMENDAÇÕES E PROVIDÊNCIAS');
  const recRows = r.recomendacoes
    .filter((p) => p.texto)
    .map((p, i) => [String(i + 1), p.texto, p.responsavel || '—', fmtDate(p.prazo)]);
  autoTable(pdf, tableTheme({
    startY: c.y,
    head: [['Nº', 'Providência / Recomendação', 'Responsável', 'Prazo Estimado']],
    body: recRows.length ? recRows : [[{ content: 'Nenhuma providência registrada.', colSpan: 4, styles: { halign: 'center' as const, textColor: [148, 163, 184] as [number, number, number] } }]],
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: contentWidth * 0.50 },
      2: { cellWidth: contentWidth * 0.25 },
      3: { cellWidth: contentWidth * 0.18, halign: 'center' },
    },
    didDrawPage: () => drawHeader(pdf, header),
  }));
  syncCursorAfterTable(c);

  // ============ 9. EVIDÊNCIAS ============
  let nextSection = 9;
  if (r.photos.length > 0) {
    drawSectionTitle(c, String(nextSection++), 'EVIDÊNCIAS FOTOGRÁFICAS');
    drawPhotoGrid(c, r.photos);
  }

  // ============ ASSINATURAS ============
  drawSectionTitle(c, String(nextSection++), 'ASSINATURAS E RESPONSABILIDADES');
  // Linha com 3 colunas de assinatura — desenhamos manualmente para inserir imagens
  const sigColW = (contentWidth - 4) / 3;
  const sigBoxH = 22;
  const sigInfoH = 14;
  const sigTotalH = sigBoxH + sigInfoH + 2;
  c.ensure(sigTotalH + 6);

  // Cabeçalho cinza
  pdf.setFillColor(...GRAY_BG);
  pdf.rect(PAGE.marginX, c.y, contentWidth, 6, 'F');
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.setTextColor(...TEXT);
  pdf.text('Técnico Responsável', PAGE.marginX + sigColW / 2, c.y + 4, { align: 'center' });
  pdf.text('Gestor / Supervisor', PAGE.marginX + sigColW + 2 + sigColW / 2, c.y + 4, { align: 'center' });
  pdf.text('Usuário do Equipamento', PAGE.marginX + sigColW * 2 + 4 + sigColW / 2, c.y + 4, { align: 'center' });
  c.advance(7);

  const drawSig = (x: number, sig: string, infoLines: Array<[string, string]>) => {
    // Caixa de assinatura
    pdf.setDrawColor(203, 213, 225);
    pdf.rect(x, c.y, sigColW, sigBoxH);
    if (sig) {
      try {
        pdf.addImage(sig, 'PNG', x + 2, c.y + 2, sigColW - 4, sigBoxH - 4);
      } catch { /* ignore */ }
    } else {
      pdf.setFont('helvetica', 'italic');
      pdf.setFontSize(8);
      pdf.setTextColor(148, 163, 184);
      pdf.text('— sem assinatura —', x + sigColW / 2, c.y + sigBoxH / 2, { align: 'center' });
    }
    // Info
    let yy = c.y + sigBoxH + 4;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...TEXT);
    for (const [k, v] of infoLines) {
      const text = pdf.splitTextToSize(`${k} ${v}`, sigColW - 4)[0];
      // Negrito apenas no rótulo
      pdf.setFont('helvetica', 'bold');
      const kW = pdf.getTextWidth(k);
      pdf.text(k, x + 2, yy);
      pdf.setFont('helvetica', 'normal');
      pdf.text(' ' + (v || '—'), x + 2 + kW, yy);
      yy += 4;
    }
  };

  drawSig(PAGE.marginX, r.assinaturaTecnico, [
    ['Nome:', r.technicianName],
    ['Data:', fmtDate(r.generatedAt)],
  ]);
  drawSig(PAGE.marginX + sigColW + 2, r.assinaturaGestor, [
    ['Nome:', r.gestorNome || '—'],
    ['Cargo:', r.gestorCargo || '—'],
  ]);
  drawSig(PAGE.marginX + sigColW * 2 + 4, r.assinaturaUsuario, [
    ['Nome:', r.usuarioNome || r.usuario || '—'],
    ['Matrícula:', r.usuarioMatricula || '—'],
  ]);
  c.advance(sigTotalH + 2);

  // Observações finais
  if (r.observacoesFinais) {
    c.advance(2);
    drawParagraph(c, 'OBSERVAÇÕES FINAIS / INFORMAÇÕES COMPLEMENTARES', { bold: true, color: NAVY, fontSize: 10 });
    drawCallout(c, r.observacoesFinais);
  }

  // Hash + paginação
  drawHashFooter(c, r.integrityHash);
  drawFooters(pdf);

  return pdf;
}

export async function downloadAdvancedReportPdf(r: AdvancedReportData): Promise<void> {
  const pdf = await generateAdvancedReportPdf(r);
  pdf.save(`${r.reportNumber}.pdf`);
}
