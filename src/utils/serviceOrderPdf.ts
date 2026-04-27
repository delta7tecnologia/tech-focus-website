import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { escapeHtml } from './reportNarrative';
import { DELTA7_LOGO_DATA_URL } from '@/assets/delta7LogoBase64';

export interface SOEvidence {
  dataUrl: string; // pode ser vazio se externo
  caption: string;
  external?: boolean;
  externalUrl?: string;
}

export interface ServiceOrderPdfData {
  osNumber: string;
  generatedAt: string;
  technicianName: string;
  clientName: string;
  clientContact: string;
  clientAddress: string;
  visitType: string;
  requestedBy: string;
  requestedByRole: string;
  scheduledAt: string;
  startedAt: string;
  finishedAt: string;
  checkin: { lat?: number; lng?: number; accuracy?: number; at?: string };
  checkout: { lat?: number; lng?: number; accuracy?: number; at?: string };
  summary: string;
  checklist: Array<{ label: string; status: string; obs?: string }>;
  materials: Array<{ item: string; qtd: string; unidade: string; valor: string }>;
  travel: { km?: string; valor_km?: string; observacao?: string };
  evidences: SOEvidence[];
  signerName: string;
  signerRole: string;
  signerDocument: string;
  signatureData: string;
  signedAt: string;
  integrityHash: string;
}

const fmtDateTime = (iso?: string) =>
  iso ? new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';

const visitLabel = (t: string) => ({
  obra: 'Visita em obra / vistoria',
  atendimento: 'Atendimento técnico no local',
  reuniao: 'Reunião com gestor / cliente',
  outro: 'Outro',
}[t] || t);

const sectionTitle = (n: string, t: string) => `
  <div style="font-size: 13px; font-weight: 800; color: #ffffff; background: #1e3a8a; padding: 6px 12px; margin: 18px 0 10px; border-radius: 3px; letter-spacing: 0.5px;">
    ${n}. ${t}
  </div>`;

const mapsLink = (lat?: number, lng?: number) =>
  lat && lng ? `https://www.google.com/maps?q=${lat},${lng}` : '';

function buildHtml(r: ServiceOrderPdfData): string {
  const checklist = r.checklist
    .filter((c) => c.label)
    .map(
      (c) => `
      <tr>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(c.label)}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;text-align:center;font-weight:700;">${escapeHtml(c.status || '—')}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;font-size:10px;color:#475569;">${escapeHtml(c.obs || '')}</td>
      </tr>`,
    )
    .join('');

  const materials = r.materials
    .filter((m) => m.item)
    .map(
      (m) => `
      <tr>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(m.item)}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;text-align:center;">${escapeHtml(m.qtd || '')}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;text-align:center;">${escapeHtml(m.unidade || '')}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;text-align:right;">${escapeHtml(m.valor || '')}</td>
      </tr>`,
    )
    .join('');

  const evidences = r.evidences
    .map((p) => {
      if (p.external) {
        return `
          <div style="break-inside:avoid;page-break-inside:avoid;width:48%;margin-bottom:14px;">
            <div style="width:100%;height:170px;border:1px dashed #94a3b8;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;background:#f1f5f9;box-sizing:border-box;">
              <div style="font-size:10px;font-weight:700;color:#475569;text-transform:uppercase;">📎 Anexo externo</div>
              <div style="font-size:9px;color:#64748b;margin-top:6px;word-break:break-all;text-align:center;">${escapeHtml(p.externalUrl || '')}</div>
            </div>
            <div style="font-size:10px;color:#475569;margin-top:4px;text-align:center;font-style:italic;">${escapeHtml(p.caption || '')}</div>
          </div>`;
      }
      return `
        <div style="break-inside:avoid;page-break-inside:avoid;width:48%;margin-bottom:14px;">
          <img src="${p.dataUrl}" style="width:100%;height:170px;object-fit:cover;border:1px solid #cbd5e1;border-radius:4px;" />
          <div style="font-size:10px;color:#475569;margin-top:4px;text-align:center;font-style:italic;">${escapeHtml(p.caption || '')}</div>
        </div>`;
    })
    .join('');

  return `
<div style="width:794px;padding:36px 44px;font-family:'Helvetica',Arial,sans-serif;color:#1e293b;background:white;box-sizing:border-box;font-size:11px;">
  <div style="border-bottom:4px solid #1e3a8a;padding-bottom:14px;margin-bottom:18px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:14px;">
      <div style="display:flex;align-items:center;gap:12px;">
        <img src="${DELTA7_LOGO_DATA_URL}" alt="Delta7" style="height:54px;" />
        <div>
          <div style="font-size:17px;font-weight:800;color:#1e3a8a;letter-spacing:0.5px;">DELTA7 SOLUÇÕES EM TECNOLOGIA</div>
          <div style="font-size:11px;color:#64748b;margin-top:2px;">ORDEM DE SERVIÇO — Visita Técnica Externa</div>
        </div>
      </div>
      <div style="text-align:right;font-size:11px;">
        <div style="font-weight:700;color:#1e3a8a;font-size:13px;">Nº ${escapeHtml(r.osNumber)}</div>
        <div style="color:#64748b;margin-top:2px;">${fmtDateTime(r.generatedAt)}</div>
      </div>
    </div>
  </div>

  ${sectionTitle('1', 'IDENTIFICAÇÃO DO ATENDIMENTO')}
  <table style="width:100%;border-collapse:collapse;font-size:11px;">
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;width:22%;">Cliente</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;width:28%;">${escapeHtml(r.clientName)}</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;width:22%;">Contato</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;width:28%;">${escapeHtml(r.clientContact || '—')}</td>
    </tr>
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Endereço</td>
      <td colspan="3" style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(r.clientAddress)}</td>
    </tr>
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Tipo de visita</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(visitLabel(r.visitType))}</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Solicitante</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml([r.requestedBy, r.requestedByRole].filter(Boolean).join(' · ') || '—')}</td>
    </tr>
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Agendado para</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${fmtDateTime(r.scheduledAt)}</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Técnico responsável</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(r.technicianName)}</td>
    </tr>
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Início</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${fmtDateTime(r.startedAt || r.checkin.at)}</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Conclusão</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${fmtDateTime(r.finishedAt || r.checkout.at)}</td>
    </tr>
  </table>

  ${sectionTitle('2', 'GEOLOCALIZAÇÃO (CHECK-IN / CHECK-OUT)')}
  <table style="width:100%;border-collapse:collapse;font-size:11px;">
    <thead>
      <tr style="background:#1e3a8a;color:white;">
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Evento</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Horário</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Coordenadas</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Precisão</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;font-weight:600;">Check-in</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;">${fmtDateTime(r.checkin.at)}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;font-size:10px;">${r.checkin.lat ? `${r.checkin.lat}, ${r.checkin.lng}` : '—'}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;">${r.checkin.accuracy ? `±${Math.round(r.checkin.accuracy)} m` : '—'}</td>
      </tr>
      <tr>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;font-weight:600;">Check-out</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;">${fmtDateTime(r.checkout.at)}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;font-size:10px;">${r.checkout.lat ? `${r.checkout.lat}, ${r.checkout.lng}` : '—'}</td>
        <td style="padding:5px 8px;border:1px solid #cbd5e1;">${r.checkout.accuracy ? `±${Math.round(r.checkout.accuracy)} m` : '—'}</td>
      </tr>
    </tbody>
  </table>
  ${mapsLink(r.checkin.lat, r.checkin.lng) ? `<p style="font-size:10px;color:#1e3a8a;margin-top:4px;">📍 Ver no mapa: ${mapsLink(r.checkin.lat, r.checkin.lng)}</p>` : ''}

  ${sectionTitle('3', 'RESUMO DO ATENDIMENTO')}
  <p style="margin:0;padding:10px 12px;background:#f8fafc;border-left:3px solid #1e3a8a;font-size:11px;line-height:1.6;text-align:justify;">
    ${escapeHtml(r.summary || '—').replace(/\n/g, '<br/>')}
  </p>

  ${checklist ? `
  ${sectionTitle('4', 'CHECKLIST DA VISITA')}
  <table style="width:100%;border-collapse:collapse;font-size:11px;">
    <thead>
      <tr style="background:#1e3a8a;color:white;">
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Item</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:center;width:120px;">Status</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Observação</th>
      </tr>
    </thead>
    <tbody>${checklist}</tbody>
  </table>` : ''}

  ${materials ? `
  ${sectionTitle('5', 'MATERIAIS / PEÇAS UTILIZADAS')}
  <table style="width:100%;border-collapse:collapse;font-size:11px;">
    <thead>
      <tr style="background:#1e3a8a;color:white;">
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:left;">Item</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:center;width:80px;">Qtd</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:center;width:80px;">Unid.</th>
        <th style="padding:6px 8px;border:1px solid #1e3a8a;text-align:right;width:100px;">Valor</th>
      </tr>
    </thead>
    <tbody>${materials}</tbody>
  </table>` : ''}

  ${(r.travel.km || r.travel.valor_km || r.travel.observacao) ? `
  ${sectionTitle('6', 'DESLOCAMENTO')}
  <table style="width:100%;border-collapse:collapse;font-size:11px;">
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;width:25%;">KM rodado</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;width:25%;">${escapeHtml(r.travel.km || '—')}</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;width:25%;">Valor por KM</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;width:25%;">${escapeHtml(r.travel.valor_km || '—')}</td>
    </tr>
    ${r.travel.observacao ? `<tr><td colspan="4" style="padding:5px 8px;border:1px solid #cbd5e1;font-size:10px;">${escapeHtml(r.travel.observacao)}</td></tr>` : ''}
  </table>` : ''}

  ${evidences ? `
  ${sectionTitle('7', 'EVIDÊNCIAS DA VISITA')}
  <div style="display:flex;flex-wrap:wrap;gap:2%;">${evidences}</div>` : ''}

  ${sectionTitle('8', 'ACEITE DO RESPONSÁVEL NO LOCAL')}
  <table style="width:100%;border-collapse:collapse;font-size:11px;margin-bottom:10px;">
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;width:25%;">Nome</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(r.signerName || '—')}</td>
    </tr>
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Cargo / Setor</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(r.signerRole || '—')}</td>
    </tr>
    ${r.signerDocument ? `<tr><td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Documento</td><td style="padding:5px 8px;border:1px solid #cbd5e1;">${escapeHtml(r.signerDocument)}</td></tr>` : ''}
    <tr>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Data/Hora do aceite</td>
      <td style="padding:5px 8px;border:1px solid #cbd5e1;">${fmtDateTime(r.signedAt)}</td>
    </tr>
  </table>

  <div style="border:1px solid #cbd5e1;border-radius:4px;padding:12px;text-align:center;background:#fff;min-height:120px;">
    ${r.signatureData
      ? `<img src="${r.signatureData}" style="max-height:100px;" />`
      : `<div style="height:100px;display:flex;align-items:center;justify-content:center;color:#94a3b8;font-style:italic;font-size:11px;">Aguardando assinatura digital</div>`}
    <div style="border-top:1px solid #1e293b;margin-top:8px;padding-top:4px;font-size:11px;font-weight:600;">
      ${escapeHtml(r.signerName || 'Responsável no local')}
    </div>
  </div>

  <div style="margin-top:14px;font-size:10px;color:#64748b;">
    <strong>Hash de integridade:</strong> <code>${escapeHtml(r.integrityHash)}</code>
  </div>
  <div style="margin-top:6px;font-size:10px;color:#64748b;text-align:center;">
    Documento gerado eletronicamente pela plataforma Delta7 Soluções em Tecnologia.
  </div>
</div>`;
}

export async function downloadServiceOrderPdf(data: ServiceOrderPdfData) {
  const html = buildHtml(data);
  const wrap = document.createElement('div');
  wrap.style.position = 'fixed';
  wrap.style.left = '-10000px';
  wrap.style.top = '0';
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  try {
    const node = wrap.firstElementChild as HTMLElement;
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgW = pageW;
    const imgH = (canvas.height * imgW) / canvas.width;
    let heightLeft = imgH;
    let position = 0;
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, position, imgW, imgH);
    heightLeft -= pageH;
    while (heightLeft > 0) {
      position = heightLeft - imgH;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/jpeg', 0.92), 'JPEG', 0, position, imgW, imgH);
      heightLeft -= pageH;
    }
    pdf.save(`OS_${data.osNumber}.pdf`);
  } finally {
    document.body.removeChild(wrap);
  }
}
