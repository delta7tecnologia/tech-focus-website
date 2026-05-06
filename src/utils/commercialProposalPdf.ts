import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { escapeHtml } from './reportNarrative';
import { DELTA7_LOGO_DATA_URL, DELTA7_LOGO_DARK_DATA_URL } from '@/assets/delta7LogoBase64';
import {
  ABOUT_DELTA7,
  BACKUP_BENEFITS,
  NOT_INCLUDED,
  SUPPORT_TEXT,
  SUPPORT_REQUIREMENTS,
  formatBRL,
} from '@/lib/proposalContent';

export interface ProposalItem {
  description: string;
  qty: number;
  unit_price: number;
}

export interface CommercialProposalPdfData {
  proposalNumber: string;
  generatedAt: string;
  validityDays: number;

  clientName: string;
  clientDocument?: string;
  clientContact?: string;
  clientEmail?: string;
  clientAddress?: string;

  salesRepName: string;
  salesRepEmail?: string;

  items: ProposalItem[];
  activationFee: number;
  discount: number;
  notes?: string;

  integrityHash: string;
  validationUrl?: string;
  qrCodeDataUrl?: string;
}

const fmtDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' }) : '—';

const sectionTitle = (text: string, mt = 22) => `
  <div style="display:flex;align-items:center;gap:10px;margin:${mt}px 0 12px;">
    <div style="width:4px;height:20px;background:#1e3a8a;border-radius:2px;"></div>
    <div style="font-size:13px;font-weight:800;color:#1e3a8a;letter-spacing:1.5px;text-transform:uppercase;">${text}</div>
    <div style="flex:1;height:1px;background:linear-gradient(to right,#cbd5e1,transparent);"></div>
  </div>`;

function buildHtml(r: CommercialProposalPdfData): string {
  const monthlyTotal = r.items.reduce((s, i) => s + i.qty * i.unit_price, 0) - (r.discount || 0);

  const itemRows = r.items
    .filter((i) => i.qty > 0)
    .map(
      (i) => `
    <tr>
      <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(i.description)}</td>
      <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:center;">${i.qty}</td>
      <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">${formatBRL(i.unit_price)}</td>
      <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;font-weight:600;">${formatBRL(i.qty * i.unit_price)}</td>
    </tr>`,
    )
    .join('');

  const bulletItem = (text: string, mb = 8) => `
    <div style="display:flex;align-items:flex-start;margin-bottom:${mb}px;line-height:1.5;">
      <span style="color:#1e3a8a;font-weight:900;margin-right:10px;font-size:13px;line-height:1.2;flex-shrink:0;">▸</span>
      <span style="flex:1;">${escapeHtml(text)}</span>
    </div>`;

  const benefitsHtml = BACKUP_BENEFITS.map((b) => bulletItem(b, 8)).join('');
  const supportReqHtml = SUPPORT_REQUIREMENTS.map((r) => bulletItem(r, 6)).join('');

  return `
<div style="width:794px;font-family:'Helvetica',Arial,sans-serif;color:#1e293b;background:white;font-size:11px;">

  <!-- ============ CAPA ============ -->
  <div style="width:794px;height:1123px;background:linear-gradient(135deg,#1e3a8a 0%,#1e40af 100%);color:white;padding:80px 60px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;">
    <div>
      <img src="${DELTA7_LOGO_DATA_URL}" alt="Delta7" style="height:80px;" />
    </div>
    <div style="text-align:left;">
      <div style="font-size:12px;letter-spacing:6px;color:#93c5fd;margin-bottom:14px;">PROPOSTA COMERCIAL</div>
      <div style="font-size:64px;font-weight:800;line-height:1;letter-spacing:-1px;">BACKUP</div>
      <div style="font-size:64px;font-weight:800;line-height:1;letter-spacing:-1px;color:#93c5fd;margin-bottom:24px;">ONLINE</div>
      <div style="font-size:22px;font-weight:300;color:#dbeafe;max-width:560px;line-height:1.4;">
        Sua empresa protegida de verdade.
      </div>
    </div>
    <div style="border-top:1px solid rgba(255,255,255,0.2);padding-top:20px;display:flex;justify-content:space-between;font-size:11px;color:#dbeafe;">
      <div>
        <div style="font-weight:700;color:white;font-size:13px;">${escapeHtml(r.clientName)}</div>
        <div style="margin-top:4px;">Proposta nº ${escapeHtml(r.proposalNumber)}</div>
      </div>
      <div style="text-align:right;">
        <div>${fmtDate(r.generatedAt)}</div>
        <div style="margin-top:4px;">Validade: ${r.validityDays} dias</div>
      </div>
    </div>
  </div>

  <!-- ============ CONTEÚDO ============ -->
  <div style="padding:36px 44px;box-sizing:border-box;">

    <table style="width:100%;border-bottom:3px solid #1e3a8a;padding-bottom:0;margin-bottom:18px;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:bottom;padding-bottom:12px;"><img src="${DELTA7_LOGO_DARK_DATA_URL}" alt="Delta7" style="height:46px;display:block;" /></td>
        <td style="vertical-align:bottom;padding-bottom:12px;text-align:right;font-size:11px;">
          <div style="font-weight:700;color:#1e3a8a;font-size:13px;">Proposta ${escapeHtml(r.proposalNumber)}</div>
          <div style="color:#64748b;margin-top:2px;">${fmtDate(r.generatedAt)}</div>
        </td>
      </tr>
    </table>

    ${sectionTitle('SOBRE A DELTA7 TECNOLOGIA')}
    <p style="margin:0;line-height:1.7;text-align:justify;color:#334155;white-space:pre-line;">${escapeHtml(ABOUT_DELTA7)}</p>

    ${sectionTitle('BENEFÍCIOS DO BACKUP ONLINE')}
    <div style="color:#334155;font-size:11px;">
      ${benefitsHtml}
    </div>

    ${sectionTitle('IDENTIFICAÇÃO DO CLIENTE')}
    <table style="width:100%;border-collapse:collapse;font-size:11px;">
      <tr>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;width:25%;">Cliente</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;" colspan="3">${escapeHtml(r.clientName)}</td>
      </tr>
      ${r.clientDocument ? `<tr>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">CNPJ / CPF</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(r.clientDocument)}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Contato</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(r.clientContact || '—')}</td>
      </tr>` : ''}
      ${r.clientEmail || r.clientAddress ? `<tr>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">E-mail</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(r.clientEmail || '—')}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Endereço</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(r.clientAddress || '—')}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">Executivo de Vendas</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(r.salesRepName)}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;background:#f1f5f9;font-weight:600;">E-mail Delta7</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;">${escapeHtml(r.salesRepEmail || '—')}</td>
      </tr>
    </table>

    <div id="prop-financ-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${sectionTitle('CONFIGURAÇÃO INICIAL')}
      <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:#1e3a8a;color:white;">
            <th style="padding:10px 12px;text-align:left;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Item</th>
            <th style="padding:10px 12px;text-align:center;width:80px;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Qtd</th>
            <th style="padding:10px 12px;text-align:right;width:130px;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Valor unit.</th>
            <th style="padding:10px 12px;text-align:right;width:130px;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;">Ativação do Serviço (taxa única)</td>
            <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">1</td>
            <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">${formatBRL(r.activationFee)}</td>
            <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;color:#1e3a8a;">${formatBRL(r.activationFee)}</td>
          </tr>
        </tbody>
      </table>

      ${sectionTitle('CENÁRIO COM BACKUP ONLINE — VALORES MENSAIS', 18)}
      <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:#1e3a8a;color:white;">
            <th style="padding:10px 12px;text-align:left;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Item</th>
            <th style="padding:10px 12px;text-align:center;width:80px;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Qtd</th>
            <th style="padding:10px 12px;text-align:right;width:130px;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Valor unit.</th>
            <th style="padding:10px 12px;text-align:right;width:130px;font-size:10px;letter-spacing:0.8px;text-transform:uppercase;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${r.items.filter(i => i.qty > 0).map((i, idx) => `
            <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
              <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;">${escapeHtml(i.description)}</td>
              <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;text-align:center;">${i.qty}</td>
              <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;text-align:right;">${formatBRL(i.unit_price)}</td>
              <td style="padding:9px 12px;border-bottom:1px solid #f1f5f9;text-align:right;font-weight:700;color:#1e3a8a;">${formatBRL(i.qty * i.unit_price)}</td>
            </tr>`).join('') || '<tr><td colspan="4" style="padding:14px;text-align:center;color:#94a3b8;font-style:italic;">Nenhum item configurado</td></tr>'}
          ${r.discount > 0 ? `<tr>
            <td colspan="3" style="padding:9px 12px;text-align:right;color:#dc2626;border-bottom:1px solid #f1f5f9;">Desconto</td>
            <td style="padding:9px 12px;text-align:right;color:#dc2626;font-weight:700;border-bottom:1px solid #f1f5f9;">- ${formatBRL(r.discount)}</td>
          </tr>` : ''}
          <tr style="background:#1e3a8a;color:white;">
            <td colspan="3" style="padding:12px;text-align:right;font-weight:800;font-size:12px;letter-spacing:0.5px;">CUSTO MENSAL TOTAL</td>
            <td style="padding:12px;text-align:right;font-weight:800;font-size:16px;">${formatBRL(monthlyTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:14px;padding:11px 14px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:3px;font-size:10px;color:#78350f;line-height:1.6;">
        <strong style="color:#92400e;">⚠ Não inclusos:</strong> ${escapeHtml(NOT_INCLUDED)}
      </div>

      ${r.notes ? `<div style="margin-top:14px;padding:12px 14px;background:#f8fafc;border-left:4px solid #1e3a8a;border-radius:3px;font-size:11px;line-height:1.6;text-align:justify;white-space:pre-line;color:#334155;"><strong style="color:#1e3a8a;display:block;margin-bottom:4px;">Observações:</strong>${escapeHtml(r.notes)}</div>` : ''}
    </div>

    <div id="prop-suporte-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${sectionTitle('SUPORTE TÉCNICO')}
      <p style="margin:0 0 10px 0;line-height:1.7;text-align:justify;color:#334155;white-space:pre-line;">${escapeHtml(SUPPORT_TEXT)}</p>
      <p style="margin:10px 0 8px 0;font-weight:700;color:#1e3a8a;font-size:11px;">Requisitos para a prestação dos serviços:</p>
      <div style="color:#334155;font-size:10.5px;">
        ${supportReqHtml}
      </div>
    </div>

    <!-- Aceite + Rodapé unidos para nunca quebrarem -->
    <div id="prop-aceite-block" style="break-inside:avoid;page-break-inside:avoid;margin-top:24px;">
      ${sectionTitle('ACEITE DA PROPOSTA')}
      <p style="font-size:10.5px;color:#475569;margin:0 0 16px 0;line-height:1.6;">
        Declaro estar de acordo com os termos, valores e condições apresentados nesta proposta comercial,
        emitida em ${fmtDate(r.generatedAt)} com validade de ${r.validityDays} dias.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:24px;">
        <tr>
          <td style="width:48%;padding-top:50px;border-top:1.5px solid #1e293b;text-align:center;font-size:11px;font-weight:700;">
            ${escapeHtml(r.clientName)}<br/>
            <span style="font-weight:400;color:#64748b;font-size:10px;">Cliente</span>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;padding-top:50px;border-top:1.5px solid #1e293b;text-align:center;font-size:11px;font-weight:700;">
            Delta7 Tecnologia<br/>
            <span style="font-weight:400;color:#64748b;font-size:10px;">${escapeHtml(r.salesRepName)} — Executivo de Vendas</span>
          </td>
        </tr>
      </table>

      <div style="margin-top:26px;padding:14px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="width:120px;vertical-align:top;text-align:center;padding-right:14px;">
              ${r.qrCodeDataUrl ? `<img src="${r.qrCodeDataUrl}" alt="QR" style="width:100px;height:100px;display:block;border:1px solid #cbd5e1;padding:3px;background:white;" />` : ''}
              <div style="font-size:8px;color:#1e3a8a;font-weight:800;margin-top:5px;letter-spacing:0.5px;">VALIDAR PROPOSTA</div>
              <div style="font-size:7px;color:#64748b;line-height:1.3;">Escaneie para verificar autenticidade</div>
            </td>
            <td style="vertical-align:top;">
              <div style="font-size:9px;color:#64748b;margin-bottom:4px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;">Hash de Legitimidade SHA-256</div>
              <div style="font-family:'Courier New',monospace;font-size:9px;color:#1e3a8a;word-break:break-all;background:white;padding:7px;border-radius:3px;border:1px solid #e2e8f0;">
                ${escapeHtml(r.integrityHash)}
              </div>
              ${r.validationUrl ? `<div style="font-size:8px;color:#475569;margin-top:6px;word-break:break-all;"><strong>Link:</strong> ${escapeHtml(r.validationUrl)}</div>` : ''}
              <div style="font-size:8.5px;color:#94a3b8;margin-top:8px;font-style:italic;line-height:1.4;">
                Documento emitido eletronicamente pela plataforma Delta7. A autenticidade pode ser verificada pelo QR Code ou link acima.
              </div>
            </td>
          </tr>
        </table>
      </div>
    </div>

  </div>
</div>`;
}

export async function downloadCommercialProposalPdf(data: CommercialProposalPdfData) {
  const validationUrl = data.validationUrl
    || `${window.location.origin}/validar-proposta/${data.integrityHash}`;
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
    tryPushAcross('prop-cenario-block', 8);
    tryPushAcross('prop-aceite-block', 8);
    tryPushAcross('prop-footer-block', 24);

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
    pdf.save(`Proposta_${data.proposalNumber}.pdf`);
  } finally {
    document.body.removeChild(wrap);
  }
}
