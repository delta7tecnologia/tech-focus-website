import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { escapeHtml } from './reportNarrative';
import { DELTA7_LOGO_DATA_URL, DELTA7_LOGO_DARK_DATA_URL } from '@/assets/delta7LogoBase64';
import {
  ABOUT_DELTA7,
  NOT_INCLUDED,
  SUPPORT_TEXT,
  SUPPORT_REQUIREMENTS,
  formatBRL,
  PROP_COLORS as C,
  DELTA7_KPIS,
  TECH_STACK,
  INFRA_HIGHLIGHTS,
  BENEFIT_CARDS,
  IDEAL_FOR,
  INSTITUTIONAL_QUOTE,
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

// ============ Ícones SVG (stroke gold) ============
const ICONS: Record<string, string> = {
  // benefit icons
  platform: '<path d="M3 5h18v11H3z"/><path d="M8 21h8M12 16v5"/>',
  cloud: '<path d="M7 18a5 5 0 1 1 .5-9.97A6 6 0 0 1 19 12a4 4 0 0 1 0 8H7z"/>',
  ransom: '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/><path d="M9 12l2 2 4-4"/>',
  auto: '<path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/>',
  retention: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/><path d="M12 7v5l3 2"/>',
  panel: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>',
  bell: '<path d="M18 16v-5a6 6 0 1 0-12 0v5l-2 2h16l-2-2z"/><path d="M10 21a2 2 0 0 0 4 0"/>',
  support: '<path d="M21 11.5a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
  // infra
  lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 1 1 8 0v4"/>',
  shield: '<path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
};

const iconCircle = (name: string, size = 44) => `
  <div style="width:${size}px;height:${size}px;border-radius:50%;background:${C.cream};border:1.5px solid ${C.gold};display:inline-block;text-align:center;line-height:${size}px;">
    <svg width="${Math.round(size * 0.55)}" height="${Math.round(size * 0.55)}" viewBox="0 0 24 24" fill="none" stroke="${C.navy}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;">
      ${ICONS[name] || ''}
    </svg>
  </div>`;

const sectionTitle = (eyebrow: string, title: string, mt = 26) => `
  <div style="margin:${mt}px 0 14px;">
    <div style="font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.gold};margin-bottom:4px;">${eyebrow}</div>
    <div style="display:flex;align-items:center;gap:14px;">
      <div style="font-size:18px;font-weight:800;color:${C.navy};letter-spacing:-0.3px;">${title}</div>
      <div style="flex:1;height:1px;background:linear-gradient(to right,${C.gold},transparent);"></div>
    </div>
  </div>`;

const goldRule = (mt = 14, mb = 14) => `
  <div style="height:1px;margin:${mt}px 0 ${mb}px;background:linear-gradient(to right,transparent,${C.gold},transparent);"></div>`;

const kpiCard = (value: string, label: string) => `
  <div style="flex:1;padding:14px 12px;background:${C.paper};border:1px solid #e7e2d2;border-top:2px solid ${C.gold};border-radius:4px;text-align:center;">
    <div style="font-size:30px;font-weight:800;color:${C.navy};line-height:1;letter-spacing:-1px;">
      <span style="color:${C.gold};">${escapeHtml(value)}</span>
    </div>
    <div style="font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${C.muted};margin-top:8px;">${escapeHtml(label)}</div>
  </div>`;

const benefitCard = (icon: string, title: string, text: string) => `
  <td style="width:25%;padding:8px;vertical-align:top;">
    <div style="background:white;border:1px solid #e7e2d2;border-radius:6px;padding:14px 12px;height:100%;box-sizing:border-box;">
      ${iconCircle(icon, 38)}
      <div style="font-size:11px;font-weight:800;color:${C.navy};margin-top:10px;letter-spacing:0.2px;">${escapeHtml(title)}</div>
      <div style="font-size:10px;color:${C.muted};line-height:1.5;margin-top:4px;">${escapeHtml(text)}</div>
    </div>
  </td>`;

const infraRow = (icon: string, title: string, text: string) => `
  <td style="width:25%;padding:6px;vertical-align:top;">
    <div style="background:${C.paper};border:1px solid #e7e2d2;border-radius:6px;padding:14px;height:100%;box-sizing:border-box;">
      ${iconCircle(icon, 36)}
      <div style="font-size:11px;font-weight:800;color:${C.navy};margin-top:10px;">${escapeHtml(title)}</div>
      <div style="font-size:10px;color:${C.muted};line-height:1.5;margin-top:4px;">${escapeHtml(text)}</div>
    </div>
  </td>`;

const numberedItem = (n: string, title: string, text: string) => `
  <td style="width:50%;padding:10px;vertical-align:top;">
    <div style="display:flex;gap:14px;align-items:flex-start;">
      <div style="font-size:34px;font-weight:800;color:${C.gold};line-height:0.9;font-family:Georgia,serif;letter-spacing:-1px;flex-shrink:0;width:46px;">${n}</div>
      <div style="flex:1;border-left:1px solid #e7e2d2;padding-left:14px;">
        <div style="font-size:12px;font-weight:800;color:${C.navy};">${escapeHtml(title)}</div>
        <div style="font-size:10.5px;color:${C.muted};line-height:1.55;margin-top:4px;">${escapeHtml(text)}</div>
      </div>
    </div>
  </td>`;

const chip = (text: string) => `
  <span style="display:inline-block;padding:6px 14px;background:white;border:1px solid ${C.gold};border-radius:999px;font-size:10px;font-weight:700;color:${C.navy};letter-spacing:0.5px;margin:4px 4px 0 0;">${escapeHtml(text)}</span>`;

const quoteBlock = (text: string, author: string) => `
  <div style="margin:28px 0 6px;padding:24px 28px 24px 60px;background:${C.cream};border:1px solid #e7e2d2;border-radius:8px;position:relative;">
    <div style="position:absolute;left:18px;top:8px;font-family:Georgia,serif;font-size:64px;line-height:1;color:${C.gold};font-weight:700;">"</div>
    <div style="font-family:Georgia,serif;font-style:italic;font-size:13px;line-height:1.6;color:${C.ink};">${escapeHtml(text)}</div>
    <div style="margin-top:10px;font-size:9.5px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.gold};">— ${escapeHtml(author)}</div>
  </div>`;

function buildHtml(r: CommercialProposalPdfData): string {
  const monthlyTotal = r.items.reduce((s, i) => s + i.qty * i.unit_price, 0) - (r.discount || 0);

  // KPIs
  const kpiW = `${Math.floor(100 / DELTA7_KPIS.length)}%`;
  const kpisHtml = `
    <table style="width:100%;border-collapse:separate;border-spacing:8px 0;margin-top:18px;">
      <tr>${DELTA7_KPIS.map(k => `<td style="width:${kpiW};">${kpiCard(k.value, k.label)}</td>`).join('')}</tr>
    </table>`;

  // Benefits 4x2
  const benefitsHtml = `
    <table style="width:100%;border-collapse:separate;border-spacing:0;">
      <tr>${BENEFIT_CARDS.slice(0, 4).map(b => benefitCard(b.icon, b.title, b.text)).join('')}</tr>
      <tr>${BENEFIT_CARDS.slice(4, 8).map(b => benefitCard(b.icon, b.title, b.text)).join('')}</tr>
    </table>`;

  // Infra
  const infraHtml = `
    <table style="width:100%;border-collapse:separate;border-spacing:0;">
      <tr>${INFRA_HIGHLIGHTS.map(h => infraRow(h.icon, h.title, h.text)).join('')}</tr>
    </table>`;

  // Tech stack
  const stackHtml = `
    <div style="background:${C.cream};border:1px solid #e7e2d2;border-radius:8px;padding:18px 22px;text-align:center;">
      <div style="font-size:9px;font-weight:700;letter-spacing:2.5px;text-transform:uppercase;color:${C.gold};margin-bottom:10px;">Stack & Tecnologias</div>
      <div>${TECH_STACK.map(chip).join('')}</div>
    </div>`;

  // Ideal for — 2 colunas
  const idealHtml = `
    <table style="width:100%;border-collapse:separate;border-spacing:0;">
      <tr>${IDEAL_FOR.slice(0, 2).map((i, idx) => numberedItem(String(idx + 1).padStart(2, '0'), i.title, i.text)).join('')}</tr>
      <tr>${IDEAL_FOR.slice(2, 4).map((i, idx) => numberedItem(String(idx + 3).padStart(2, '0'), i.title, i.text)).join('')}</tr>
    </table>`;

  // Support requirements (bullets dourados)
  const supportReqHtml = SUPPORT_REQUIREMENTS.map(text => `
    <div style="display:flex;align-items:flex-start;margin-bottom:7px;line-height:1.55;">
      <span style="color:${C.gold};font-size:10px;margin-right:10px;flex-shrink:0;line-height:1.55;">◆</span>
      <span style="flex:1;color:${C.ink};">${escapeHtml(text)}</span>
    </div>`).join('');

  // Linhas de items mensais
  const itemRows = r.items.filter(i => i.qty > 0).map((i, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#ffffff' : C.paper};">
      <td style="padding:10px 14px;border-bottom:1px solid #eae3cf;color:${C.ink};">${escapeHtml(i.description)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eae3cf;text-align:center;color:${C.ink};">${i.qty}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eae3cf;text-align:right;color:${C.ink};">${formatBRL(i.unit_price)}</td>
      <td style="padding:10px 14px;border-bottom:1px solid #eae3cf;text-align:right;font-weight:700;color:${C.navy};">${formatBRL(i.qty * i.unit_price)}</td>
    </tr>`).join('') || `<tr><td colspan="4" style="padding:16px;text-align:center;color:${C.muted};font-style:italic;">Nenhum item configurado</td></tr>`;

  return `
<div style="width:794px;font-family:'Helvetica',Arial,sans-serif;color:${C.ink};background:white;font-size:11px;">

  <!-- ============ CAPA ============ -->
  <div style="width:794px;height:1123px;background:linear-gradient(135deg,${C.navy} 0%,${C.navyDeep} 100%);color:white;padding:80px 60px;box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;page-break-after:always;position:relative;overflow:hidden;">
    <!-- Pattern de pontos dourados -->
    <div style="position:absolute;inset:0;opacity:0.06;background-image:radial-gradient(${C.gold} 1.2px, transparent 1.2px);background-size:18px 18px;"></div>

    <div style="position:relative;display:flex;justify-content:space-between;align-items:center;">
      <img src="${DELTA7_LOGO_DATA_URL}" alt="Delta7" style="height:70px;" />
      <div style="text-align:right;font-size:10px;color:${C.goldLight};letter-spacing:3px;text-transform:uppercase;">Delta7 Tecnologia</div>
    </div>

    <div style="position:relative;text-align:left;">
      <div style="width:60px;height:2px;background:${C.gold};margin-bottom:24px;"></div>
      <div style="font-size:11px;letter-spacing:8px;color:${C.goldLight};margin-bottom:18px;font-weight:600;">PROPOSTA COMERCIAL</div>
      <div style="font-size:78px;font-weight:800;line-height:0.95;letter-spacing:-2px;">BACKUP</div>
      <div style="font-size:78px;font-weight:800;line-height:0.95;letter-spacing:-2px;color:${C.gold};margin-bottom:28px;font-style:italic;">Online.</div>
      <div style="font-size:20px;font-weight:300;color:#dfe4ef;max-width:560px;line-height:1.45;">
        Continuidade do seu negócio<br/>
        protegida com tecnologia de verdade.
      </div>
    </div>

    <div style="position:relative;border-top:1px solid ${C.gold};padding-top:22px;display:flex;justify-content:space-between;font-size:11px;color:#dfe4ef;">
      <div>
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.goldLight};margin-bottom:6px;">Preparado para</div>
        <div style="font-weight:700;color:white;font-size:15px;">${escapeHtml(r.clientName)}</div>
        <div style="margin-top:4px;color:#b9c2d6;">Proposta nº ${escapeHtml(r.proposalNumber)}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.goldLight};margin-bottom:6px;">Emitida em</div>
        <div style="font-weight:700;color:white;font-size:13px;">${fmtDate(r.generatedAt)}</div>
        <div style="margin-top:4px;color:#b9c2d6;">Validade: ${r.validityDays} dias</div>
      </div>
    </div>
  </div>

  <!-- ============ CONTEÚDO ============ -->
  <div style="padding:38px 46px;box-sizing:border-box;">

    <!-- Header de página -->
    <table style="width:100%;border-bottom:2px solid ${C.navy};padding-bottom:0;margin-bottom:8px;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:bottom;padding-bottom:12px;"><img src="${DELTA7_LOGO_DARK_DATA_URL}" alt="Delta7" style="height:42px;display:block;" /></td>
        <td style="vertical-align:bottom;padding-bottom:12px;text-align:right;">
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};font-weight:700;">Proposta Comercial</div>
          <div style="font-weight:800;color:${C.navy};font-size:13px;margin-top:3px;">Nº ${escapeHtml(r.proposalNumber)}</div>
          <div style="color:${C.muted};margin-top:2px;font-size:10px;">${fmtDate(r.generatedAt)}</div>
        </td>
      </tr>
    </table>
    <div style="height:2px;background:${C.gold};width:60px;margin-bottom:6px;"></div>

    ${sectionTitle('Quem somos', 'Sobre a Delta7 Tecnologia', 18)}
    <p style="margin:0;line-height:1.75;text-align:justify;color:${C.ink};white-space:pre-line;">${escapeHtml(ABOUT_DELTA7)}</p>
    ${kpisHtml}

    ${sectionTitle('Vantagens', 'Por que Backup Online')}
    ${benefitsHtml}

    ${sectionTitle('Infraestrutura', 'Onde seus dados ficam')}
    ${infraHtml}

    <div style="margin-top:22px;">${stackHtml}</div>

    ${sectionTitle('Perfil ideal', 'Esta solução é ideal se...')}
    ${idealHtml}

    ${sectionTitle('Identificação', 'Identificação do Cliente')}
    <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e7e2d2;border-radius:6px;overflow:hidden;">
      <tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};width:25%;border-bottom:1px solid #eae3cf;">Cliente</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;" colspan="3">${escapeHtml(r.clientName)}</td>
      </tr>
      ${r.clientDocument ? `<tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};border-bottom:1px solid #eae3cf;">CNPJ / CPF</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;">${escapeHtml(r.clientDocument)}</td>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};border-bottom:1px solid #eae3cf;">Contato</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;">${escapeHtml(r.clientContact || '—')}</td>
      </tr>` : ''}
      ${r.clientEmail || r.clientAddress ? `<tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};border-bottom:1px solid #eae3cf;">E-mail</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;">${escapeHtml(r.clientEmail || '—')}</td>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};border-bottom:1px solid #eae3cf;">Endereço</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;">${escapeHtml(r.clientAddress || '—')}</td>
      </tr>` : ''}
      <tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};">Executivo de Vendas</td>
        <td style="padding:9px 12px;color:${C.ink};">${escapeHtml(r.salesRepName)}</td>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};">E-mail Delta7</td>
        <td style="padding:9px 12px;color:${C.ink};">${escapeHtml(r.salesRepEmail || '—')}</td>
      </tr>
    </table>

    <div id="prop-financ-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${sectionTitle('Investimento', 'Configuração inicial')}
      <table style="width:100%;border-collapse:separate;border-spacing:0;font-size:11px;border:1px solid #e7e2d2;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:${C.navy};color:white;">
            <th style="padding:11px 14px;text-align:left;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Item</th>
            <th style="padding:11px 14px;text-align:center;width:70px;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Qtd</th>
            <th style="padding:11px 14px;text-align:right;width:130px;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Valor unit.</th>
            <th style="padding:11px 14px;text-align:right;width:130px;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:11px 14px;color:${C.ink};">Ativação do Serviço (taxa única)</td>
            <td style="padding:11px 14px;text-align:center;color:${C.ink};">1</td>
            <td style="padding:11px 14px;text-align:right;color:${C.ink};">${formatBRL(r.activationFee)}</td>
            <td style="padding:11px 14px;text-align:right;font-weight:800;color:${C.gold};">${formatBRL(r.activationFee)}</td>
          </tr>
        </tbody>
      </table>

      ${sectionTitle('Mensalidade', 'Cenário com Backup Online', 22)}
      <table style="width:100%;border-collapse:separate;border-spacing:0;font-size:11px;border:1px solid #e7e2d2;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:${C.navy};color:white;">
            <th style="padding:11px 14px;text-align:left;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Item</th>
            <th style="padding:11px 14px;text-align:center;width:70px;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Qtd</th>
            <th style="padding:11px 14px;text-align:right;width:130px;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Valor unit.</th>
            <th style="padding:11px 14px;text-align:right;width:130px;font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;font-weight:700;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
          ${r.discount > 0 ? `<tr>
            <td colspan="3" style="padding:10px 14px;text-align:right;color:#b91c1c;border-bottom:1px solid #eae3cf;">Desconto</td>
            <td style="padding:10px 14px;text-align:right;color:#b91c1c;font-weight:700;border-bottom:1px solid #eae3cf;">- ${formatBRL(r.discount)}</td>
          </tr>` : ''}
          <tr style="background:linear-gradient(90deg,${C.navy},${C.navyDeep});color:white;">
            <td colspan="3" style="padding:14px;text-align:right;font-weight:700;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;">Custo Mensal Total</td>
            <td style="padding:14px;text-align:right;font-weight:800;font-size:18px;color:${C.gold};letter-spacing:-0.3px;">${formatBRL(monthlyTotal)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:14px;padding:13px 16px;background:${C.cream};border-left:3px solid ${C.gold};border-radius:3px;font-size:10px;color:${C.ink};line-height:1.6;">
        <strong style="color:${C.navy};letter-spacing:0.5px;">Não inclusos:</strong> ${escapeHtml(NOT_INCLUDED)}
      </div>

      ${r.notes ? `<div style="margin-top:14px;padding:13px 16px;background:${C.paper};border-left:3px solid ${C.navy};border-radius:3px;font-size:11px;line-height:1.6;text-align:justify;white-space:pre-line;color:${C.ink};"><strong style="color:${C.navy};display:block;margin-bottom:4px;letter-spacing:0.5px;">Observações</strong>${escapeHtml(r.notes)}</div>` : ''}
    </div>

    <div id="prop-suporte-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${sectionTitle('Atendimento', 'Suporte Técnico')}
      <p style="margin:0 0 12px 0;line-height:1.7;text-align:justify;color:${C.ink};white-space:pre-line;">${escapeHtml(SUPPORT_TEXT)}</p>
      <p style="margin:14px 0 10px 0;font-weight:800;color:${C.navy};font-size:11px;letter-spacing:0.3px;">Requisitos para a prestação dos serviços</p>
      <div style="font-size:10.5px;">
        ${supportReqHtml}
      </div>
    </div>

    ${quoteBlock(INSTITUTIONAL_QUOTE.text, INSTITUTIONAL_QUOTE.author)}

    <!-- Aceite + Rodapé unidos para nunca quebrarem -->
    <div id="prop-aceite-block" style="break-inside:avoid;page-break-inside:avoid;margin-top:26px;">
      ${sectionTitle('Formalização', 'Aceite da Proposta', 8)}
      <p style="font-size:10.5px;color:${C.muted};margin:0 0 16px 0;line-height:1.65;">
        Declaro estar de acordo com os termos, valores e condições apresentados nesta proposta comercial,
        emitida em ${fmtDate(r.generatedAt)} com validade de ${r.validityDays} dias.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:30px;">
        <tr>
          <td style="width:48%;padding-top:54px;border-top:1.5px solid ${C.navy};text-align:center;font-size:11px;font-weight:800;color:${C.navy};">
            ${escapeHtml(r.clientName)}<br/>
            <span style="font-weight:500;color:${C.muted};font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;">Cliente</span>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;padding-top:54px;border-top:1.5px solid ${C.navy};text-align:center;font-size:11px;font-weight:800;color:${C.navy};">
            Delta7 Tecnologia<br/>
            <span style="font-weight:500;color:${C.muted};font-size:9.5px;letter-spacing:1.2px;text-transform:uppercase;">${escapeHtml(r.salesRepName)} — Executivo de Vendas</span>
          </td>
        </tr>
      </table>

      <div style="margin-top:28px;padding:16px;background:${C.cream};border:1px solid #e7e2d2;border-radius:8px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="width:130px;vertical-align:top;text-align:center;padding-right:16px;">
              ${r.qrCodeDataUrl ? `<img src="${r.qrCodeDataUrl}" alt="QR" style="width:108px;height:108px;display:block;border:2px solid ${C.gold};padding:4px;background:white;border-radius:4px;" />` : ''}
              <div style="font-size:8px;color:${C.gold};font-weight:800;margin-top:6px;letter-spacing:1.5px;">VALIDAR PROPOSTA</div>
              <div style="font-size:7.5px;color:${C.muted};line-height:1.3;margin-top:2px;">Escaneie para verificar autenticidade</div>
            </td>
            <td style="vertical-align:top;">
              <div style="font-size:9px;color:${C.gold};margin-bottom:5px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;">Hash de Legitimidade SHA-256</div>
              <div style="font-family:'Courier New',monospace;font-size:9px;color:${C.navy};word-break:break-all;background:white;padding:8px 10px;border-radius:4px;border:1px solid #e7e2d2;">
                ${escapeHtml(r.integrityHash)}
              </div>
              ${r.validationUrl ? `<div style="font-size:8px;color:${C.muted};margin-top:7px;word-break:break-all;"><strong style="color:${C.navy};">Link:</strong> ${escapeHtml(r.validationUrl)}</div>` : ''}
              <div style="font-size:8.5px;color:${C.muted};margin-top:9px;font-style:italic;line-height:1.45;">
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
        color: { dark: '#0a1f44', light: '#ffffff' },
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
    tryPushAcross('prop-financ-block', 8);
    tryPushAcross('prop-suporte-block', 8);
    tryPushAcross('prop-aceite-block', 12);

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
