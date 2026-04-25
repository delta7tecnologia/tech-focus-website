import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  narrateEstadoGeral,
  narrateLacre,
  narrateStatusFinal,
} from './reportNarrative';
import {
  PAGE, contentWidth,
  PdfCursor, drawHeader, drawFooters,
  drawSectionTitle, drawParagraph, drawCallout,
  drawPhotoGrid, drawHashFooter,
  type HeaderInfo,
} from './pdfHelpers';

export interface ReportPhoto {
  dataUrl: string;
  caption: string;
  external?: boolean;
  externalUrl?: string;
  externalProvider?: string;
}

export interface ReportData {
  reportNumber: string;
  technicianName: string;
  companyName: string;
  equipment: string;
  generatedAt: string;
  triagem: { estado: string; lacre: string; acessorios: string };
  diagnostico: { testes: string; causaRaiz: string; pecas: string };
  conclusao: { recomendacoes: string; statusFinal: string };
  photos: ReportPhoto[];
  integrityHash: string;
}

const NAVY: [number, number, number] = [30, 58, 138];
const GRAY_BG: [number, number, number] = [241, 245, 249];

function statusInfo(s: string): { color: [number, number, number] } {
  if (s === 'Resolvido') return { color: [22, 163, 74] };
  if (s === 'Condenado') return { color: [220, 38, 38] };
  return { color: [217, 119, 6] };
}

function syncCursorAfterTable(c: PdfCursor) {
  const pdf = c.pdf;
  const last = (pdf as any).lastAutoTable;
  if (last) {
    pdf.setPage(pdf.getNumberOfPages());
    c.y = last.finalY + 4;
  }
}

export async function generateReportPdf(report: ReportData): Promise<jsPDF> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const header: HeaderInfo = {
    title: 'DELTA7 SOLUÇÕES EM TECNOLOGIA',
    subtitle: 'Laudo Técnico de Atendimento',
    reportNumber: report.reportNumber,
    generatedAt: report.generatedAt,
  };
  drawHeader(pdf, header);
  const c = new PdfCursor(pdf, header);

  // Identificação
  autoTable(pdf, {
    startY: c.y,
    theme: 'grid',
    margin: { left: PAGE.marginX, right: PAGE.marginX },
    bodyStyles: { fontSize: 10, cellPadding: 2.5 },
    body: [
      [{ content: 'Técnico Responsável', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, report.technicianName],
      [{ content: 'Cliente', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, report.companyName],
      [{ content: 'Equipamento', styles: { fillColor: GRAY_BG, fontStyle: 'bold' } }, report.equipment],
    ],
    columnStyles: {
      0: { cellWidth: contentWidth * 0.30 },
      1: { cellWidth: contentWidth * 0.70 },
    },
    didDrawPage: () => drawHeader(pdf, header),
  });
  syncCursorAfterTable(c);

  // 1. Triagem
  drawSectionTitle(c, '1', 'TRIAGEM INICIAL');
  drawParagraph(c, narrateEstadoGeral(report.triagem.estado), { fontSize: 10, lineHeight: 4.4 });
  drawParagraph(c, narrateLacre(report.triagem.lacre), { fontSize: 10, lineHeight: 4.4 });
  if (report.triagem.acessorios) {
    drawParagraph(c, `Acessórios recebidos: ${report.triagem.acessorios}`, { fontSize: 10, lineHeight: 4.4 });
  }

  // 2. Diagnóstico
  drawSectionTitle(c, '2', 'DIAGNÓSTICO TÉCNICO');
  drawParagraph(c, 'Testes realizados:', { bold: true, color: NAVY, fontSize: 10 });
  drawParagraph(c, report.diagnostico.testes || 'Não informado.', { fontSize: 10, lineHeight: 4.4 });
  c.advance(1);
  drawParagraph(c, 'Causa raiz identificada:', { bold: true, color: NAVY, fontSize: 10 });
  drawParagraph(c, report.diagnostico.causaRaiz || 'Não informado.', { fontSize: 10, lineHeight: 4.4 });
  c.advance(1);
  drawParagraph(c, 'Peças/componentes necessários:', { bold: true, color: NAVY, fontSize: 10 });
  drawParagraph(c, report.diagnostico.pecas || 'Nenhuma peça adicional necessária.', { fontSize: 10, lineHeight: 4.4 });

  // 3. Conclusão
  drawSectionTitle(c, '3', 'CONCLUSÃO E RECOMENDAÇÕES');
  drawParagraph(c, narrateStatusFinal(report.conclusao.statusFinal), { fontSize: 10, lineHeight: 4.4 });
  if (report.conclusao.recomendacoes) {
    c.advance(1);
    drawParagraph(c, 'Recomendações ao cliente:', { bold: true, color: NAVY, fontSize: 10 });
    drawParagraph(c, report.conclusao.recomendacoes, { fontSize: 10, lineHeight: 4.4 });
  }

  // Selo de status
  const si = statusInfo(report.conclusao.statusFinal);
  c.advance(2);
  c.ensure(11);
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  const label = `STATUS FINAL: ${report.conclusao.statusFinal.toUpperCase()}`;
  const w = pdf.getTextWidth(label) + 12;
  pdf.setFillColor(...si.color);
  pdf.roundedRect(PAGE.marginX, c.y, w, 8, 1, 1, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.text(label, PAGE.marginX + 6, c.y + 5.5);
  pdf.setTextColor(30, 41, 59);
  c.advance(11);

  // 4. Evidências
  if (report.photos.length > 0) {
    drawSectionTitle(c, '4', 'EVIDÊNCIAS FOTOGRÁFICAS');
    drawPhotoGrid(c, report.photos);
  }

  // Hash + paginação
  drawHashFooter(c, report.integrityHash);
  drawFooters(pdf);

  return pdf;
}

export async function downloadReportPdf(report: ReportData): Promise<void> {
  const pdf = await generateReportPdf(report);
  pdf.save(`${report.reportNumber}.pdf`);
}
