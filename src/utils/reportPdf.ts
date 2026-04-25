import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  narrateEstadoGeral,
  narrateLacre,
  narrateStatusFinal,
  escapeHtml,
} from './reportNarrative';
import { DELTA7_LOGO_DATA_URL } from '@/assets/delta7LogoBase64';

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
  generatedAt: string; // ISO
  triagem: {
    estado: string;
    lacre: string;
    acessorios: string;
  };
  diagnostico: {
    testes: string;
    causaRaiz: string;
    pecas: string;
  };
  conclusao: {
    recomendacoes: string;
    statusFinal: string;
  };
  photos: ReportPhoto[];
  integrityHash: string;
}

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

function buildHtml(r: ReportData): string {
  const photos = r.photos
    .map((p) => {
      if (p.external) {
        return `
        <div style="break-inside: avoid; page-break-inside: avoid; width: 48%; margin-bottom: 16px;">
          <div style="width: 100%; height: 180px; border: 1px dashed #94a3b8; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; background: #f1f5f9; box-sizing: border-box;">
            <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">📎 Anexo externo</div>
            <div style="font-size: 11px; color: #1e3a8a; margin-top: 6px; font-weight: 600;">${escapeHtml(p.externalProvider || 'Link externo')}</div>
            <div style="font-size: 9px; color: #64748b; margin-top: 6px; word-break: break-all; text-align: center; max-width: 100%;">${escapeHtml(p.externalUrl || '')}</div>
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px; text-align: center; font-style: italic;">
            ${escapeHtml(p.caption || 'Sem legenda')}
          </div>
        </div>`;
      }
      return `
        <div style="break-inside: avoid; page-break-inside: avoid; width: 48%; margin-bottom: 16px;">
          <img src="${p.dataUrl}" style="width: 100%; height: 180px; object-fit: cover; border: 1px solid #cbd5e1; border-radius: 4px;" />
          <div style="font-size: 10px; color: #475569; margin-top: 4px; text-align: center; font-style: italic;">
            ${escapeHtml(p.caption || 'Sem legenda')}
          </div>
        </div>`;
    })
    .join('');

  const statusColor =
    r.conclusao.statusFinal === 'Resolvido'
      ? '#16a34a'
      : r.conclusao.statusFinal === 'Condenado'
      ? '#dc2626'
      : '#d97706';

  return `
<div style="width: 794px; padding: 40px 48px; font-family: 'Helvetica', Arial, sans-serif; color: #1e293b; background: white; box-sizing: border-box;">
  <!-- Cabeçalho timbrado -->
  <div style="border-bottom: 4px solid #1e3a8a; padding-bottom: 16px; margin-bottom: 24px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 16px;">
      <div style="display: flex; align-items: center; gap: 14px;">
        <img src="${DELTA7_LOGO_DATA_URL}" alt="Delta7" style="height: 56px; width: auto; display: block;" />
        <div>
          <div style="font-size: 18px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px;">
            DELTA7 SOLUÇÕES EM TECNOLOGIA
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            Laudo Técnico de Atendimento
          </div>
        </div>
      </div>
      <div style="text-align: right; font-size: 11px;">
        <div style="font-weight: 700; color: #1e3a8a; font-size: 13px;">
          Nº ${r.reportNumber}
        </div>
        <div style="color: #64748b; margin-top: 2px;">
          ${formatDateTime(r.generatedAt)}
        </div>
      </div>
    </div>
  </div>

  <!-- Identificação -->
  <table style="width: 100%; font-size: 12px; margin-bottom: 24px; border-collapse: collapse;">
    <tr>
      <td style="padding: 6px 8px; background: #f1f5f9; font-weight: 700; width: 130px; border: 1px solid #e2e8f0;">Técnico Responsável</td>
      <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${escapeHtml(r.technicianName)}</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; background: #f1f5f9; font-weight: 700; border: 1px solid #e2e8f0;">Cliente</td>
      <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${escapeHtml(r.companyName)}</td>
    </tr>
    <tr>
      <td style="padding: 6px 8px; background: #f1f5f9; font-weight: 700; border: 1px solid #e2e8f0;">Equipamento</td>
      <td style="padding: 6px 8px; border: 1px solid #e2e8f0;">${escapeHtml(r.equipment)}</td>
    </tr>
  </table>

  <!-- 1. Triagem -->
  <div style="margin-bottom: 20px;">
    <div style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 10px; margin-bottom: 10px;">
      1. TRIAGEM INICIAL
    </div>
    <div style="font-size: 12px; line-height: 1.6; text-align: justify; color: #334155;">
      <p style="margin-bottom: 8px;">${escapeHtml(narrateEstadoGeral(r.triagem.estado))}</p>
      <p style="margin-bottom: 8px;">${escapeHtml(narrateLacre(r.triagem.lacre))}</p>
      ${r.triagem.acessorios ? `<p style="margin-bottom: 8px;"><strong>Acessórios recebidos:</strong> ${escapeHtml(r.triagem.acessorios)}</p>` : ''}
    </div>
  </div>

  <!-- 2. Diagnóstico -->
  <div style="margin-bottom: 20px;">
    <div style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 10px; margin-bottom: 10px;">
      2. DIAGNÓSTICO TÉCNICO
    </div>
    <div style="font-size: 12px; line-height: 1.6; text-align: justify; color: #334155;">
      <p style="margin-bottom: 8px;"><strong>Testes realizados:</strong><br/>${escapeHtml(r.diagnostico.testes || 'Não informado.')}</p>
      <p style="margin-bottom: 8px;"><strong>Causa raiz identificada:</strong><br/>${escapeHtml(r.diagnostico.causaRaiz || 'Não informado.')}</p>
      <p style="margin-bottom: 8px;"><strong>Peças/componentes necessários:</strong><br/>${escapeHtml(r.diagnostico.pecas || 'Nenhuma peça adicional necessária.')}</p>
    </div>
  </div>

  <!-- 3. Conclusão -->
  <div style="margin-bottom: 20px;">
    <div style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 10px; margin-bottom: 10px;">
      3. CONCLUSÃO E RECOMENDAÇÕES
    </div>
    <div style="font-size: 12px; line-height: 1.6; text-align: justify; color: #334155;">
      <p style="margin-bottom: 8px;">${escapeHtml(narrateStatusFinal(r.conclusao.statusFinal))}</p>
      ${r.conclusao.recomendacoes ? `<p style="margin-bottom: 8px;"><strong>Recomendações ao cliente:</strong><br/>${escapeHtml(r.conclusao.recomendacoes)}</p>` : ''}
      <p style="margin-top: 12px;">
        <span style="display: inline-block; padding: 4px 12px; background: ${statusColor}; color: white; font-weight: 700; border-radius: 4px; font-size: 12px;">
          STATUS FINAL: ${r.conclusao.statusFinal.toUpperCase()}
        </span>
      </p>
    </div>
  </div>

  ${r.photos.length > 0 ? `
  <!-- 4. Evidências -->
  <div style="margin-bottom: 20px;">
    <div style="font-size: 14px; font-weight: 700; color: #1e3a8a; border-left: 4px solid #1e3a8a; padding-left: 10px; margin-bottom: 10px;">
      4. EVIDÊNCIAS FOTOGRÁFICAS
    </div>
    <div style="display: flex; flex-wrap: wrap; gap: 4%;">
      ${photos}
    </div>
  </div>
  ` : ''}

  <!-- Rodapé com hash -->
  <div style="margin-top: 32px; padding-top: 12px; border-top: 2px solid #1e3a8a;">
    <div style="font-size: 9px; color: #64748b; margin-bottom: 4px;">
      <strong>Hash de integridade SHA-256:</strong>
    </div>
    <div style="font-family: 'Courier New', monospace; font-size: 9px; color: #1e3a8a; word-break: break-all; background: #f1f5f9; padding: 6px; border-radius: 3px;">
      ${r.integrityHash}
    </div>
    <div style="font-size: 9px; color: #94a3b8; text-align: center; margin-top: 8px; font-style: italic;">
      Este documento possui integridade garantida pela hash de segurança da plataforma Delta7.
    </div>
  </div>
</div>`;
}

export async function generateReportPdf(report: ReportData): Promise<jsPDF> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.innerHTML = buildHtml(report);
  document.body.appendChild(container);

  try {
    const target = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(target, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth(); // 210mm
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297mm

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL('image/jpeg', 0.92);

    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    return pdf;
  } finally {
    document.body.removeChild(container);
  }
}

export async function downloadReportPdf(report: ReportData): Promise<void> {
  const pdf = await generateReportPdf(report);
  pdf.save(`${report.reportNumber}.pdf`);
}
