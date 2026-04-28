import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { escapeHtml } from './reportNarrative';
import { DELTA7_LOGO_DATA_URL } from '@/assets/delta7LogoBase64';

export interface SOEvidence {
  dataUrl: string; // pode ser vazio se externo/não-imagem
  caption: string;
  external?: boolean;
  externalUrl?: string;
  kind?: 'image' | 'file' | 'video';
  fileName?: string;
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
  // Computados
  qrCodeDataUrl?: string;
  validationUrl?: string;
  auditLog?: Array<{ event: string; at: string }>;
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

function evidenceCard(p: SOEvidence): string {
  // Anexo externo / não-imagem
  if (p.external || (p.kind && p.kind !== 'image')) {
    const label = p.kind === 'video' ? '🎥 Vídeo' : '📎 Anexo';
    const link = p.externalUrl || '';
    return `
      <div style="break-inside:avoid;page-break-inside:avoid;width:48%;margin-bottom:14px;">
        <div style="width:100%;height:170px;border:1px dashed #94a3b8;border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:12px;background:#f1f5f9;box-sizing:border-box;">
          <div style="font-size:11px;font-weight:700;color:#475569;">${label}</div>
          ${p.fileName ? `<div style="font-size:10px;color:#1e3a8a;margin-top:6px;text-align:center;font-weight:600;">${escapeHtml(p.fileName)}</div>` : ''}
          ${link ? `<div style="font-size:8px;color:#64748b;margin-top:6px;word-break:break-all;text-align:center;">${escapeHtml(link)}</div>` : ''}
        </div>
        <div style="font-size:10px;color:#475569;margin-top:4px;text-align:center;font-style:italic;">${escapeHtml(p.caption || '')}</div>
      </div>`;
  }
  return `
    <div style="break-inside:avoid;page-break-inside:avoid;width:48%;margin-bottom:14px;">
      <img src="${p.dataUrl}" style="width:100%;height:170px;object-fit:cover;border:1px solid #cbd5e1;border-radius:4px;" />
      <div style="font-size:10px;color:#475569;margin-top:4px;text-align:center;font-style:italic;">${escapeHtml(p.caption || '')}</div>
    </div>`;
}

function chunkEvidences(evs: SOEvidence[], size = 6): SOEvidence[][] {
  const out: SOEvidence[][] = [];
  for (let i = 0; i < evs.length; i += size) out.push(evs.slice(i, i + size));
  return out;
}

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

  const evChunks = chunkEvidences(r.evidences || []);
  const evidencesHtml = evChunks
    .map((chunk, idx) => `
      <div style="display:flex;flex-wrap:wrap;gap:2%;${idx > 0 ? 'page-break-before:always;break-before:page;margin-top:12px;' : ''}">
        ${chunk.map(evidenceCard).join('')}
      </div>`)
    .join('');

  const auditAlert = r.auditLog && r.auditLog.some((e) => e.event === 'edited_after_emission')
    ? `<div style="background:#fef3c7;border:1px solid #f59e0b;color:#92400e;padding:8px 12px;border-radius:4px;font-size:10px;margin-top:10px;">
        ⚠️ Este documento foi editado após a emissão original. Consulte o log de auditoria via QR Code.
       </div>`
    : '';

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
  ${auditAlert}

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
  ${mapsLink(r.checkin.lat, r.checkin.lng) ? `<p style="font-size:10px;color:#1e3a8a;margin-top:4px;">📍 Ver no mapa: <a href="${mapsLink(r.checkin.lat, r.checkin.lng)}" style="color:#1e3a8a;">${mapsLink(r.checkin.lat, r.checkin.lng)}</a></p>` : ''}

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

  ${evidencesHtml ? `
  ${sectionTitle('7', 'EVIDÊNCIAS DA VISITA')}
  ${evidencesHtml}` : ''}

  <div id="so-aceite-block" style="break-inside:avoid;page-break-inside:avoid;">
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
  </div>

  <!-- Rodapé com hash + QR Code (não pode quebrar entre páginas) -->
  <div id="so-footer-block" style="margin-top:24px;padding-top:12px;border-top:2px solid #1e3a8a;break-inside:avoid;page-break-inside:avoid;-webkit-column-break-inside:avoid;">
    <div style="display:flex;gap:16px;align-items:flex-start;">
      <div style="flex-shrink:0;text-align:center;">
        ${r.qrCodeDataUrl ? `<img src="${r.qrCodeDataUrl}" alt="QR Validação" style="width:110px;height:110px;display:block;border:1px solid #cbd5e1;padding:4px;background:white;" />` : ''}
        <div style="font-size:8px;color:#1e3a8a;font-weight:700;margin-top:4px;">VALIDAR DOCUMENTO</div>
        <div style="font-size:7px;color:#64748b;max-width:110px;">Escaneie para verificar autenticidade</div>
      </div>
      <div style="flex:1;min-width:0;">
        <div style="font-size:9px;color:#64748b;margin-bottom:4px;"><strong>Hash de Legitimidade SHA-256:</strong></div>
        <div style="font-family:'Courier New',monospace;font-size:9px;color:#1e3a8a;word-break:break-all;background:#f1f5f9;padding:6px;border-radius:3px;">
          ${escapeHtml(r.integrityHash)}
        </div>
        ${r.validationUrl ? `<div style="font-size:8px;color:#475569;margin-top:6px;word-break:break-all;"><strong>Link de validação:</strong> ${escapeHtml(r.validationUrl)}</div>` : ''}
        <div style="font-size:9px;color:#94a3b8;margin-top:8px;font-style:italic;">
          Documento gerado eletronicamente pela plataforma Delta7. A autenticidade pode ser verificada pelo QR Code ou link acima.
        </div>
      </div>
    </div>
  </div>
</div>`;
}

export async function downloadServiceOrderPdf(data: ServiceOrderPdfData) {
  // Gera QR Code apontando para a URL pública de validação
  const validationUrl = data.validationUrl
    || `${window.location.origin}/validar-os/${data.integrityHash}`;
  let qrCodeDataUrl = data.qrCodeDataUrl;
  if (!qrCodeDataUrl) {
    try {
      qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
        margin: 1,
        width: 220,
        errorCorrectionLevel: 'M',
        color: { dark: '#1e3a8a', light: '#ffffff' },
      });
    } catch (e) {
      console.error('Falha ao gerar QR Code:', e);
    }
  }

  const html = buildHtml({ ...data, qrCodeDataUrl, validationUrl });
  const wrap = document.createElement('div');
  wrap.style.position = 'fixed';
  wrap.style.left = '-10000px';
  wrap.style.top = '0';
  wrap.innerHTML = html;
  document.body.appendChild(wrap);

  try {
    const node = wrap.firstElementChild as HTMLElement;

    // Anti-quebra do rodapé (mesma lógica do reportPdfAdvanced)
    const pageWidthMM = 210;
    const pageHeightMM = 297;
    const pxPerMM = node.offsetWidth / pageWidthMM;
    const pageHeightPx = pageHeightMM * pxPerMM;

    const tryPushAcross = (id: string, baseMargin = 24) => {
      const el = node.querySelector(`#${id}`) as HTMLElement | null;
      if (!el) return;
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      const startPage = Math.floor(top / pageHeightPx);
      const endPage = Math.floor((bottom - 1) / pageHeightPx);
      if (endPage > startPage) {
        const nextPageStart = (startPage + 1) * pageHeightPx;
        const extraPx = nextPageStart - top + 8;
        el.style.marginTop = `${extraPx + baseMargin}px`;
      }
    };
    tryPushAcross('so-aceite-block', 8);
    tryPushAcross('so-footer-block', 24);

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
