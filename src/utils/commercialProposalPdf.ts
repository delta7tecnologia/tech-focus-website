import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { escapeHtml } from './reportNarrative';
import { DELTA7_LOGO_DATA_URL, DELTA7_LOGO_DARK_DATA_URL } from '@/assets/delta7LogoBase64';
import { ALTATEK_LOGO_DATA_URL } from '@/assets/altatekLogoBase64';
import { ALTATEK_LOGO_MODELO01_DATA_URL } from '@/assets/altatekLogoModelo01Base64';
import {
  ABOUT_DELTA7,
  NOT_INCLUDED,
  SUPPORT_TEXT,
  SUPPORT_REQUIREMENTS,
  formatBRL,
  PROP_COLORS as C,
  DELTA7_KPIS,
  INFRA_HIGHLIGHTS,
  BENEFIT_CARDS,
  IDEAL_FOR,
  INSTITUTIONAL_QUOTE,
  DEFAULT_SECTIONS,
  type ProposalSections,
} from '@/lib/proposalContent';
import {
  renderFeaturedClientsModelo01,
  renderFeaturedClientsModelo02,
  type FeaturedClientPdf,
} from './proposalClientsBlock';

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
  sections?: ProposalSections;
  template?: 'modelo01' | 'modelo02';
  showAltatekLogo?: boolean;
  featuredClients?: FeaturedClientPdf[];
}

export type ProposalTemplate = 'modelo01' | 'modelo02';

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

const iconCircle = (name: string, size = 44) => {
  const inner = Math.round(size * 0.55);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${inner}" height="${inner}" viewBox="0 0 24 24" fill="none" stroke="${C.navy}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
  const dataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  const pad = Math.round((size - inner) / 2);
  return `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${C.cream};border:1.5px solid ${C.navy};box-sizing:border-box;padding:${pad}px;"><img src="${dataUrl}" width="${inner}" height="${inner}" style="display:block;" alt="" /></div>`;
};

// Converte texto com \n\n em parágrafos HTML separados — evita white-space:pre-line
// que faz o html2canvas distribuir espaços irregulares entre palavras.
const htmlParas = (text: string, style = '') =>
  text.split(/\n\n+/).map(p =>
    `<p style="margin:0 0 10px 0;line-height:1.65;${style}">${escapeHtml(p.trim()).replace(/\n/g, '<br/>')}</p>`
  ).join('') + '<div style="margin-bottom:-10px;"></div>';

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
  <div style="flex:1;padding:14px 12px;background:${C.paper};border:1px solid #e7e2d2;border-top:2px solid ${C.gold};border-radius:4px;text-align:center;break-inside:avoid;page-break-inside:avoid;">
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
  const S = { ...DEFAULT_SECTIONS, ...(r.sections || {}) };
  const itemsSubtotal = r.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0);
  const discount = Number(r.discount) || 0;
  const activationFee = Number(r.activationFee) || 0;
  const monthlyTotal = itemsSubtotal - discount;
  const firstMonthTotal = monthlyTotal + activationFee;

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

  // Tech stack removido a pedido

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
<div style="width:794px;font-family:'Helvetica',Arial,sans-serif;color:${C.ink};background:white;font-size:11px;word-spacing:0;font-kerning:none;-webkit-font-smoothing:antialiased;">

  <!-- ============ CAPA ============ -->
  <div style="width:794px;height:1123px;background:linear-gradient(135deg,${C.navy} 0%,${C.navyDeep} 100%);color:white;padding:80px 60px;box-sizing:border-box;page-break-after:always;position:relative;">
    <!-- Pattern de pontos dourados -->
    <div style="position:absolute;inset:0;opacity:0.06;background-image:radial-gradient(${C.gold} 1.2px, transparent 1.2px);background-size:18px 18px;"></div>

    <table style="position:relative;width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;"><img src="${DELTA7_LOGO_DATA_URL}" alt="Delta7" style="height:70px;display:block;" /></td>
        <td style="vertical-align:middle;text-align:right;">
          <div style="font-size:10px;color:${C.goldLight};letter-spacing:3px;text-transform:uppercase;">Delta7 Tecnologia</div>
          ${r.showAltatekLogo ? `<div style="margin-top:14px;display:inline-block;padding:8px 12px;border-radius:6px;border:1px solid rgba(255,255,255,0.25);">
            <div style="font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);font-weight:600;margin-bottom:5px;text-align:center;">Revenda Autorizada</div>
            <img src="${ALTATEK_LOGO_MODELO01_DATA_URL}" alt="Altatek" style="height:26px;display:block;margin:0 auto;" />
          </div>` : ''}
        </td>
      </tr>
    </table>

    <div style="position:relative;text-align:left;margin-top:280px;">
      <div style="width:60px;height:2px;background:${C.gold};margin-bottom:24px;"></div>
      <div style="font-size:11px;letter-spacing:8px;color:${C.goldLight};margin-bottom:18px;font-weight:600;">PROPOSTA COMERCIAL</div>
      <div style="font-size:78px;font-weight:800;line-height:0.95;letter-spacing:-2px;">BACKUP</div>
      <div style="font-size:78px;font-weight:800;line-height:0.95;letter-spacing:-2px;color:${C.gold};margin-bottom:28px;font-style:italic;">Online.</div>
      <div style="font-size:20px;font-weight:300;color:#dfe4ef;max-width:560px;line-height:1.45;">
        Continuidade do seu negócio<br/>
        protegida com tecnologia de verdade.
      </div>
    </div>

    <table style="position:absolute;bottom:80px;left:60px;right:60px;width:674px;border-collapse:collapse;border-top:1px solid ${C.gold};">
      <tr>
        <td style="padding-top:22px;font-size:11px;color:#dfe4ef;vertical-align:top;">
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.goldLight};margin-bottom:6px;">Preparado para</div>
          <div style="font-weight:700;color:white;font-size:15px;">${escapeHtml(r.clientName)}</div>
          <div style="margin-top:4px;color:#b9c2d6;">Proposta nº ${escapeHtml(r.proposalNumber)}</div>
        </td>
        <td style="padding-top:22px;font-size:11px;color:#dfe4ef;vertical-align:top;text-align:right;">
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.goldLight};margin-bottom:6px;">Emitida em</div>
          <div style="font-weight:700;color:white;font-size:13px;">${fmtDate(r.generatedAt)}</div>
          <div style="margin-top:4px;color:#b9c2d6;">Validade: ${r.validityDays} dias</div>
        </td>
      </tr>
    </table>
  </div>
  </div>

  <!-- ============ CONTEÚDO ============ -->
  <div style="padding:44px 54px;box-sizing:border-box;">

    <!-- Header de página -->
    <table style="width:100%;border-bottom:2px solid ${C.navy};padding-bottom:0;margin-bottom:10px;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:bottom;padding-bottom:14px;"><img src="${DELTA7_LOGO_DARK_DATA_URL}" alt="Delta7" style="height:40px;display:block;" /></td>
        <td style="vertical-align:bottom;padding-bottom:14px;text-align:right;">
          <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${C.gold};font-weight:600;">Proposta Comercial</div>
          <div style="font-weight:700;color:${C.navy};font-size:13px;margin-top:3px;">Nº ${escapeHtml(r.proposalNumber)}</div>
          <div style="color:${C.muted};margin-top:2px;font-size:10px;">${fmtDate(r.generatedAt)}</div>
        </td>
      </tr>
    </table>
    <div style="height:2px;background:${C.gold};width:48px;margin-bottom:8px;"></div>

    ${S.showAbout ? `<div data-keep="1">${sectionTitle('Quem somos', 'Sobre a Delta7 Tecnologia', 18)}
    ${htmlParas(ABOUT_DELTA7, `color:${C.ink};`)}
    ${kpisHtml}</div>` : ''}

    ${S.showBenefits ? `<div data-keep="1">${sectionTitle('Vantagens', 'Por que Backup Online')}
    ${benefitsHtml}</div>` : ''}

    ${S.showInfra ? `<div data-keep="1">${sectionTitle('Infraestrutura', 'Onde seus dados ficam')}
    ${infraHtml}</div>` : ''}

    ${S.showIdealFor ? `<div data-keep="1">${sectionTitle('Perfil ideal', 'Esta solução é ideal se...')}
    ${idealHtml}</div>` : ''}

    ${S.showClients ? renderFeaturedClientsModelo01(r.featuredClients, C, sectionTitle) : ''}


    <div data-keep="1">
    ${sectionTitle('Cliente', 'Identificação do Cliente')}
    <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e7e2d2;border-radius:6px;overflow:hidden;">
      <tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};width:25%;border-bottom:1px solid #eae3cf;">Razão Social</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;" colspan="3">${escapeHtml(r.clientName)}</td>
      </tr>
      <tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};border-bottom:1px solid #eae3cf;">CNPJ / CPF</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;">${escapeHtml(r.clientDocument || '—')}</td>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};border-bottom:1px solid #eae3cf;">Contato</td>
        <td style="padding:9px 12px;color:${C.ink};border-bottom:1px solid #eae3cf;">${escapeHtml(r.clientContact || '—')}</td>
      </tr>
      <tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};">E-mail</td>
        <td style="padding:9px 12px;color:${C.ink};">${escapeHtml(r.clientEmail || '—')}</td>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};">Endereço</td>
        <td style="padding:9px 12px;color:${C.ink};">${escapeHtml(r.clientAddress || '—')}</td>
      </tr>
    </table>
    </div>

    <div data-keep="1">
    ${sectionTitle('Delta7', 'Executivo Responsável')}
    <table style="width:100%;border-collapse:collapse;font-size:11px;border:1px solid #e7e2d2;border-radius:6px;overflow:hidden;">
      <tr>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};width:25%;">Executivo de Vendas</td>
        <td style="padding:9px 12px;color:${C.ink};">${escapeHtml(r.salesRepName)}</td>
        <td style="padding:9px 12px;background:${C.cream};font-weight:700;color:${C.navy};width:18%;">E-mail</td>
        <td style="padding:9px 12px;color:${C.ink};">${escapeHtml(r.salesRepEmail || '—')}</td>
      </tr>
    </table>
    </div>

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
            <td style="padding:11px 14px;text-align:right;font-weight:800;color:${C.navy};">${formatBRL(r.activationFee)}</td>
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
          <tr style="background:${C.navy};color:#ffffff;">
            <td colspan="3" style="padding:14px;text-align:right;font-weight:700;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#ffffff;background:${C.navy};">Custo Mensal Total</td>
            <td style="padding:14px;text-align:right;font-weight:800;font-size:18px;color:#ffffff;letter-spacing:-0.3px;background:${C.navy};">${formatBRL(monthlyTotal)}</td>
          </tr>
        </tbody>
      </table>

      <table style="width:100%;border-collapse:separate;border-spacing:0;margin-top:14px;font-size:11px;border:1px solid #e7e2d2;border-radius:6px;overflow:hidden;">
        <thead>
          <tr style="background:${C.cream};">
            <th colspan="2" style="padding:10px 14px;text-align:left;font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;font-weight:800;color:${C.navy};">Resumo do investimento</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding:9px 14px;color:${C.ink};border-bottom:1px solid #eae3cf;">Subtotal mensal (itens)</td>
            <td style="padding:9px 14px;text-align:right;color:${C.ink};border-bottom:1px solid #eae3cf;">${formatBRL(itemsSubtotal)}</td>
          </tr>
          ${discount > 0 ? `<tr>
            <td style="padding:9px 14px;color:#b91c1c;border-bottom:1px solid #eae3cf;">(−) Desconto mensal</td>
            <td style="padding:9px 14px;text-align:right;color:#b91c1c;font-weight:700;border-bottom:1px solid #eae3cf;">- ${formatBRL(discount)}</td>
          </tr>` : ''}
          <tr style="background:${C.paper};">
            <td style="padding:10px 14px;color:${C.navy};font-weight:700;border-bottom:1px solid #eae3cf;">= Mensalidade recorrente</td>
            <td style="padding:10px 14px;text-align:right;color:${C.navy};font-weight:800;border-bottom:1px solid #eae3cf;">${formatBRL(monthlyTotal)}</td>
          </tr>
          <tr>
            <td style="padding:9px 14px;color:${C.ink};border-bottom:1px solid #eae3cf;">(+) Taxa de Ativação (cobrada uma única vez)</td>
            <td style="padding:9px 14px;text-align:right;color:${C.ink};border-bottom:1px solid #eae3cf;">${formatBRL(activationFee)}</td>
          </tr>
          <tr style="background:${C.navy};color:#ffffff;">
            <td style="padding:12px 14px;font-weight:700;font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:#ffffff;background:${C.navy};">Investimento no 1º mês</td>
            <td style="padding:12px 14px;text-align:right;font-weight:800;font-size:15px;color:#ffffff;background:${C.navy};">${formatBRL(firstMonthTotal)}</td>
          </tr>
          <tr>
            <td colspan="2" style="padding:9px 14px;color:${C.muted};font-size:9.5px;font-style:italic;background:${C.cream};">A partir do 2º mês, o valor recorrente é de <strong style="color:${C.navy};font-style:normal;">${formatBRL(monthlyTotal)}/mês</strong>.</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top:14px;padding:13px 16px;background:${C.cream};border-left:3px solid ${C.gold};border-radius:3px;font-size:10px;color:${C.ink};line-height:1.6;">
        <strong style="color:${C.navy};letter-spacing:0.5px;">Não inclusos:</strong> ${escapeHtml(NOT_INCLUDED)}
      </div>

      ${r.notes ? `<div style="margin-top:14px;padding:13px 16px;background:${C.paper};border-left:3px solid ${C.navy};border-radius:3px;font-size:11px;color:${C.ink};"><strong style="color:${C.navy};display:block;margin-bottom:6px;letter-spacing:0.3px;">Observações</strong>${htmlParas(r.notes, `color:${C.ink};font-size:11px;`)}</div>` : ''}
    </div>

    <div id="prop-suporte-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${sectionTitle('Atendimento', 'Suporte Técnico')}
      ${htmlParas(SUPPORT_TEXT, `color:${C.ink};`)}
      ${S.showSupportReqs ? `<p style="margin:14px 0 10px 0;font-weight:800;color:${C.navy};font-size:11px;letter-spacing:0.3px;">Requisitos para a prestação dos serviços</p>
      <div style="font-size:10.5px;">
        ${supportReqHtml}
      </div>` : ''}
    </div>

    ${S.showQuote ? quoteBlock(INSTITUTIONAL_QUOTE.text, INSTITUTIONAL_QUOTE.author) : ''}

    <!-- Aceite + Rodapé unidos para nunca quebrarem -->
    <div id="prop-aceite-block" style="break-inside:avoid;page-break-inside:avoid;margin-top:26px;">
      ${sectionTitle('Formalização', 'Aceite da Proposta', 8)}
      <p style="font-size:10.5px;color:${C.muted};margin:0 0 16px 0;line-height:1.65;">
        Declaro estar de acordo com os termos, valores e condições apresentados nesta proposta comercial,
        emitida em ${fmtDate(r.generatedAt)} com validade de ${r.validityDays} dias.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:30px;">
        <tr>
          <td style="width:48%;padding-top:54px;border-top:1.5px solid ${C.navy};text-align:center;font-size:11px;font-weight:700;color:${C.navy};word-spacing:normal;letter-spacing:0;">
            ${escapeHtml(r.clientName)}<br/>
            <span style="font-weight:400;color:${C.muted};font-size:9px;letter-spacing:1px;text-transform:uppercase;">Cliente</span>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;padding-top:54px;border-top:1.5px solid ${C.navy};text-align:center;font-size:11px;font-weight:700;color:${C.navy};word-spacing:normal;letter-spacing:0;">
            Delta7 Tecnologia<br/>
            <span style="font-weight:400;color:${C.muted};font-size:9px;letter-spacing:1px;text-transform:uppercase;">${escapeHtml(r.salesRepName)} &mdash; Executivo de Vendas</span>
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

// ============================================================
// MODELO 02 — Editorial / Clean / Minimalista
// Linhas finas, muito espaço em branco, sem cards coloridos,
// tipografia editorial. Sem QR Code (versão impressa).
// ============================================================
function buildHtmlMinimal(r: CommercialProposalPdfData): string {
  const S = { ...DEFAULT_SECTIONS, ...(r.sections || {}) };
  const itemsSubtotal = r.items.reduce((s, i) => s + (Number(i.qty) || 0) * (Number(i.unit_price) || 0), 0);
  const discount = Number(r.discount) || 0;
  const activationFee = Number(r.activationFee) || 0;
  const monthlyTotal = itemsSubtotal - discount;
  const firstMonthTotal = monthlyTotal + activationFee;

  const NAVY = C.navy;
  const INK = '#0f172a';
  const MUTED = '#64748b';
  const LINE = '#e2e8f0';

  const off = S.showClients ? 1 : 0;
  const N = (n: number) => String(n + off).padStart(2, '0');

  const eyebrow = (txt: string) => `<div style="font-size:9px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${MUTED};margin-bottom:6px;">${escapeHtml(txt)}</div>`;
  const h2 = (txt: string) => `<h2 style="font-size:20px;font-weight:600;color:${NAVY};margin:0 0 14px 0;letter-spacing:-0.4px;">${escapeHtml(txt)}</h2>`;
  const hr = () => `<div style="height:1px;background:${LINE};margin:22px 0;"></div>`;
  const section = (eb: string, title: string, body: string, mt = 24) =>
    `<section data-keep="1" style="margin-top:${mt}px;">${eyebrow(eb)}${h2(title)}${body}</section>`;

  const itemRows = r.items.filter(i => i.qty > 0).map(i => `
    <tr>
      <td style="padding:11px 0;border-bottom:1px solid ${LINE};color:${INK};font-size:11px;">${escapeHtml(i.description)}</td>
      <td style="padding:11px 0;border-bottom:1px solid ${LINE};text-align:center;color:${MUTED};font-size:11px;">${i.qty}</td>
      <td style="padding:11px 0;border-bottom:1px solid ${LINE};text-align:right;color:${MUTED};font-size:11px;">${formatBRL(i.unit_price)}</td>
      <td style="padding:11px 0;border-bottom:1px solid ${LINE};text-align:right;color:${INK};font-weight:600;font-size:11px;">${formatBRL(i.qty * i.unit_price)}</td>
    </tr>`).join('') || `<tr><td colspan="4" style="padding:14px 0;text-align:center;color:${MUTED};font-style:italic;font-size:11px;">Nenhum item configurado</td></tr>`;

  return `
<div style="width:794px;font-family:'Helvetica',Arial,sans-serif;color:${INK};background:white;font-size:11px;line-height:1.6;word-spacing:0;font-kerning:none;-webkit-font-smoothing:antialiased;">

  <!-- ============ CAPA MINIMALISTA ============ -->
  <div style="width:794px;height:1123px;background:white;padding:80px 70px;box-sizing:border-box;page-break-after:always;border-top:6px solid ${NAVY};position:relative;">

    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;"><img src="${DELTA7_LOGO_DARK_DATA_URL}" alt="Delta7" style="height:54px;display:block;" /></td>
        <td style="vertical-align:top;text-align:right;">
          <div style="font-size:9px;letter-spacing:3px;text-transform:uppercase;color:${MUTED};">Proposta Comercial</div>
          <div style="font-size:11px;color:${INK};margin-top:6px;font-weight:600;">Nº ${escapeHtml(r.proposalNumber)}</div>
          ${r.showAltatekLogo ? `<div style="margin-top:14px;display:inline-block;background:${NAVY};padding:8px 12px;border-radius:6px;">
            <div style="font-size:7px;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.6);font-weight:600;margin-bottom:5px;text-align:center;">Revenda Autorizada</div>
            <img src="${ALTATEK_LOGO_DATA_URL}" alt="Altatek" style="height:22px;display:block;margin:0 auto;" />
          </div>` : ''}
        </td>
      </tr>
    </table>

    <div style="margin-top:240px;">
      <div style="font-size:10px;letter-spacing:6px;text-transform:uppercase;color:${MUTED};margin-bottom:24px;">Backup Online · Continuidade</div>
      <div style="font-size:64px;font-weight:300;color:${NAVY};line-height:1.05;letter-spacing:-2px;">
        Tecnologia<br/>
        que <span style="font-weight:600;">protege</span>
      </div>
      <div style="font-size:64px;font-weight:300;color:${INK};line-height:1.05;letter-spacing:-2px;">
        a continuidade.
      </div>
      <div style="width:48px;height:2px;background:${NAVY};margin:36px 0 28px 0;"></div>
      <div style="font-size:14px;color:${MUTED};max-width:540px;line-height:1.6;">
        Solução Delta7 de backup em nuvem para infraestrutura crítica — proteção contínua, recuperação rápida e conformidade com a LGPD.
      </div>
    </div>

    <table style="position:absolute;bottom:80px;left:70px;right:70px;width:654px;border-collapse:collapse;border-top:1px solid ${LINE};">
      <tr>
        <td style="padding-top:18px;font-size:10px;color:${MUTED};vertical-align:top;">
          <div style="letter-spacing:2px;text-transform:uppercase;font-size:8.5px;">Preparado para</div>
          <div style="color:${INK};font-weight:600;font-size:13px;margin-top:4px;">${escapeHtml(r.clientName)}</div>
        </td>
        <td style="padding-top:18px;font-size:10px;color:${MUTED};vertical-align:top;text-align:right;">
          <div style="letter-spacing:2px;text-transform:uppercase;font-size:8.5px;">Emitida em</div>
          <div style="color:${INK};font-weight:600;font-size:13px;margin-top:4px;">${fmtDate(r.generatedAt)}</div>
          <div style="margin-top:2px;">Validade ${r.validityDays} dias</div>
        </td>
      </tr>
    </table>
  </div>

  <!-- ============ MIOLO ============ -->
  <div style="padding:50px 70px;box-sizing:border-box;">

    <table style="width:100%;border-collapse:collapse;padding-bottom:14px;border-bottom:1px solid ${LINE};">
      <tr>
        <td style="vertical-align:middle;padding-bottom:14px;"><img src="${DELTA7_LOGO_DARK_DATA_URL}" alt="Delta7" style="height:30px;display:block;" /></td>
        <td style="vertical-align:middle;padding-bottom:14px;text-align:right;font-size:10px;color:${MUTED};letter-spacing:1.5px;text-transform:uppercase;">Proposta nº ${escapeHtml(r.proposalNumber)}</td>
      </tr>
    </table>

    ${S.showAbout ? section('01', 'A Delta7 Tecnologia', `
      ${htmlParas(ABOUT_DELTA7, `color:${INK};font-size:11.5px;`)}
      <table style="width:100%;margin-top:28px;border-collapse:collapse;">
        <tr>
          ${DELTA7_KPIS.map(k => `
            <td style="text-align:left;padding-right:24px;border-left:2px solid ${NAVY};padding-left:14px;">
              <div style="font-size:30px;font-weight:300;color:${NAVY};line-height:1;letter-spacing:-1px;">${escapeHtml(k.value)}</div>
              <div style="font-size:9px;color:${MUTED};letter-spacing:1.5px;text-transform:uppercase;margin-top:6px;">${escapeHtml(k.label)}</div>
            </td>`).join('')}
        </tr>
      </table>
    `, 36) : ''}

    ${S.showBenefits ? section('02', 'Por que Backup Online', `
      <table style="width:100%;border-collapse:collapse;">
        ${BENEFIT_CARDS.map((b, idx) => `
          <tr>
            <td style="padding:12px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:36px;color:${MUTED};font-size:10px;font-weight:600;letter-spacing:1px;">${String(idx + 1).padStart(2, '0')}</td>
            <td style="padding:12px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:200px;color:${NAVY};font-weight:600;font-size:11.5px;">${escapeHtml(b.title)}</td>
            <td style="padding:12px 0;border-bottom:1px solid ${LINE};vertical-align:top;color:${INK};font-size:11px;line-height:1.55;">${escapeHtml(b.text)}</td>
          </tr>`).join('')}
      </table>
    `) : ''}

    ${S.showInfra ? section('03', 'Infraestrutura', `
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          ${INFRA_HIGHLIGHTS.map(h => `
            <td style="width:25%;padding:0 12px 0 0;vertical-align:top;">
              <div style="border-top:2px solid ${NAVY};padding-top:14px;">
                <div style="font-size:11.5px;font-weight:600;color:${NAVY};">${escapeHtml(h.title)}</div>
                <div style="font-size:10.5px;color:${MUTED};line-height:1.55;margin-top:6px;">${escapeHtml(h.text)}</div>
              </div>
            </td>`).join('')}
        </tr>
      </table>
    `) : ''}

    ${S.showIdealFor ? section('04', 'Para quem é', `
      <table style="width:100%;border-collapse:collapse;">
        ${IDEAL_FOR.map((i, idx) => `
          <tr>
            <td style="padding:14px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:50px;font-size:11px;color:${MUTED};font-weight:600;letter-spacing:1px;">${String(idx + 1).padStart(2, '0')}</td>
            <td style="padding:14px 0;border-bottom:1px solid ${LINE};vertical-align:top;">
              <div style="font-size:12px;font-weight:600;color:${NAVY};">${escapeHtml(i.title)}</div>
              <div style="font-size:11px;color:${INK};line-height:1.6;margin-top:4px;">${escapeHtml(i.text)}</div>
            </td>
          </tr>`).join('')}
      </table>
    `) : ''}

    ${S.showClients ? renderFeaturedClientsModelo02(r.featuredClients, { navy: NAVY, ink: INK, muted: MUTED, line: LINE }, '05', section) : ''}

    ${section(N(5), 'Cliente & Executivo', `
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="width:50%;padding:0 24px 0 0;vertical-align:top;border-top:1px solid ${LINE};padding-top:16px;">
            <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};margin-bottom:10px;">Cliente</div>
            <div style="font-size:13px;font-weight:600;color:${NAVY};">${escapeHtml(r.clientName)}</div>
            <div style="font-size:10.5px;color:${INK};margin-top:8px;line-height:1.7;">
              ${r.clientDocument ? `<div><span style="color:${MUTED};">Documento:</span> ${escapeHtml(r.clientDocument)}</div>` : ''}
              ${r.clientContact ? `<div><span style="color:${MUTED};">Contato:</span> ${escapeHtml(r.clientContact)}</div>` : ''}
              ${r.clientEmail ? `<div><span style="color:${MUTED};">E-mail:</span> ${escapeHtml(r.clientEmail)}</div>` : ''}
              ${r.clientAddress ? `<div><span style="color:${MUTED};">Endereço:</span> ${escapeHtml(r.clientAddress)}</div>` : ''}
            </div>
          </td>
          <td style="width:50%;padding:0;vertical-align:top;border-top:1px solid ${LINE};padding-top:16px;">
            <div style="font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};margin-bottom:10px;">Executivo Delta7</div>
            <div style="font-size:13px;font-weight:600;color:${NAVY};">${escapeHtml(r.salesRepName)}</div>
            <div style="font-size:10.5px;color:${INK};margin-top:8px;line-height:1.7;">
              ${r.salesRepEmail ? `<div><span style="color:${MUTED};">E-mail:</span> ${escapeHtml(r.salesRepEmail)}</div>` : ''}
              <div><span style="color:${MUTED};">Validade:</span> ${r.validityDays} dias</div>
              <div><span style="color:${MUTED};">Emissão:</span> ${fmtDate(r.generatedAt)}</div>
            </div>
          </td>
        </tr>
      </table>
    `)}

    <div id="prop-financ-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${section(N(6), 'Investimento', `
        <table style="width:100%;border-collapse:collapse;margin-top:8px;">
          <thead>
            <tr>
              <th style="text-align:left;padding:0 0 10px 0;border-bottom:2px solid ${NAVY};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};font-weight:600;">Item</th>
              <th style="text-align:center;width:60px;padding:0 0 10px 0;border-bottom:2px solid ${NAVY};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};font-weight:600;">Qtd</th>
              <th style="text-align:right;width:120px;padding:0 0 10px 0;border-bottom:2px solid ${NAVY};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};font-weight:600;">Unit.</th>
              <th style="text-align:right;width:130px;padding:0 0 10px 0;border-bottom:2px solid ${NAVY};font-size:9px;letter-spacing:2px;text-transform:uppercase;color:${MUTED};font-weight:600;">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <table style="width:100%;border-collapse:collapse;margin-top:22px;">
          <tr>
            <td style="padding:8px 0;color:${MUTED};font-size:11px;">Subtotal mensal</td>
            <td style="padding:8px 0;text-align:right;color:${INK};font-size:11px;">${formatBRL(itemsSubtotal)}</td>
          </tr>
          ${discount > 0 ? `<tr>
            <td style="padding:8px 0;color:${MUTED};font-size:11px;">Desconto</td>
            <td style="padding:8px 0;text-align:right;color:#b91c1c;font-size:11px;">− ${formatBRL(discount)}</td>
          </tr>` : ''}
          <tr>
            <td style="padding:14px 0 8px 0;border-top:1px solid ${LINE};color:${NAVY};font-size:12px;font-weight:600;">Mensalidade recorrente</td>
            <td style="padding:14px 0 8px 0;border-top:1px solid ${LINE};text-align:right;color:${NAVY};font-size:18px;font-weight:600;letter-spacing:-0.5px;">${formatBRL(monthlyTotal)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;color:${MUTED};font-size:11px;">Taxa de ativação <span style="font-style:italic;">(única)</span></td>
            <td style="padding:8px 0;text-align:right;color:${INK};font-size:11px;">${formatBRL(activationFee)}</td>
          </tr>
          <tr>
            <td style="padding:14px 0;border-top:2px solid ${NAVY};color:${NAVY};font-size:10px;letter-spacing:2px;text-transform:uppercase;font-weight:600;">Investimento no 1º mês</td>
            <td style="padding:14px 0;border-top:2px solid ${NAVY};text-align:right;color:${NAVY};font-size:22px;font-weight:600;letter-spacing:-0.8px;">${formatBRL(firstMonthTotal)}</td>
          </tr>
        </table>

        <div style="margin-top:18px;padding:14px 0;border-top:1px solid ${LINE};font-size:10px;color:${MUTED};line-height:1.6;">
          <strong style="color:${NAVY};font-weight:600;">Não inclusos:</strong> ${escapeHtml(NOT_INCLUDED)}
        </div>

        ${r.notes ? `<div style="margin-top:14px;padding:14px 0;border-top:1px solid ${LINE};font-size:11px;color:${INK};"><strong style="color:${NAVY};font-weight:600;display:block;margin-bottom:6px;">Observações</strong>${htmlParas(r.notes, `color:${INK};font-size:11px;`)}</div>` : ''}
      `)}
    </div>

    <div id="prop-suporte-block" style="break-inside:avoid;page-break-inside:avoid;">
      ${section(N(7), 'Suporte Técnico', `
        ${htmlParas(SUPPORT_TEXT, `color:${INK};font-size:11px;`)}
        ${S.showSupportReqs ? `<table style="width:100%;border-collapse:collapse;margin-top:18px;">
          ${SUPPORT_REQUIREMENTS.map(t => `
            <tr>
              <td style="padding:8px 0;border-bottom:1px solid ${LINE};vertical-align:top;width:18px;color:${NAVY};font-size:11px;">·</td>
              <td style="padding:8px 0;border-bottom:1px solid ${LINE};color:${INK};font-size:10.5px;line-height:1.55;">${escapeHtml(t)}</td>
            </tr>`).join('')}
        </table>` : ''}
      `)}
    </div>

    ${S.showQuote ? `<div style="margin-top:36px;padding:0;">
      <div style="font-family:Georgia,serif;font-style:italic;font-size:18px;line-height:1.5;color:${NAVY};font-weight:300;letter-spacing:-0.3px;">"${escapeHtml(INSTITUTIONAL_QUOTE.text)}"</div>
      <div style="margin-top:14px;font-size:9.5px;color:${MUTED};letter-spacing:2px;text-transform:uppercase;">— ${escapeHtml(INSTITUTIONAL_QUOTE.author)}</div>
    </div>` : ''}

    <div id="prop-aceite-block" style="break-inside:avoid;page-break-inside:avoid;margin-top:40px;">
      ${eyebrow(N(8))}
      ${h2('Aceite')}
      <p style="font-size:10.5px;color:${MUTED};margin:0 0 24px 0;line-height:1.65;">
        Declaro estar de acordo com os termos, valores e condições apresentados nesta proposta, emitida em ${fmtDate(r.generatedAt)} com validade de ${r.validityDays} dias.
      </p>
      <table style="width:100%;border-collapse:collapse;margin-top:50px;">
        <tr>
          <td style="width:48%;padding-top:60px;border-top:1px solid ${INK};text-align:left;font-size:11px;color:${NAVY};font-weight:600;">
            ${escapeHtml(r.clientName)}
            <div style="font-weight:400;color:${MUTED};font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px;">Cliente</div>
          </td>
          <td style="width:4%;"></td>
          <td style="width:48%;padding-top:60px;border-top:1px solid ${INK};text-align:left;font-size:11px;color:${NAVY};font-weight:600;">
            Delta7 Tecnologia
            <div style="font-weight:400;color:${MUTED};font-size:9px;letter-spacing:1.5px;text-transform:uppercase;margin-top:4px;">${escapeHtml(r.salesRepName)} — Executivo</div>
          </td>
        </tr>
      </table>

      <div style="margin-top:40px;padding-top:14px;border-top:1px solid ${LINE};font-size:8.5px;color:${MUTED};line-height:1.6;text-align:center;letter-spacing:0.5px;">
        Documento emitido eletronicamente pela plataforma Delta7 Tecnologia.<br/>
        Verificação de autenticidade disponível mediante solicitação · ${escapeHtml(r.proposalNumber)}
      </div>
    </div>

  </div>
</div>`;
}

async function buildPdf(data: CommercialProposalPdfData): Promise<jsPDF> {
  const template: ProposalTemplate = data.template || 'modelo01';
  const validationUrl = data.validationUrl
    || `${window.location.origin}/validar-proposta/${data.integrityHash}`;
  let qrCodeDataUrl = data.qrCodeDataUrl;
  if (template === 'modelo01' && !qrCodeDataUrl) {
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

  const html = template === 'modelo02'
    ? buildHtmlMinimal({ ...data, qrCodeDataUrl, validationUrl })
    : buildHtml({ ...data, qrCodeDataUrl, validationUrl });
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

    const pushElement = (el: HTMLElement, baseMargin: number) => {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      const startPage = Math.floor(top / pageHeightPx);
      const endPage = Math.floor((bottom - 1) / pageHeightPx);
      // Only push if it crosses AND fits in a single page
      if (endPage > startPage && el.offsetHeight < pageHeightPx - 40) {
        const nextPageStart = (startPage + 1) * pageHeightPx;
        const extraPx = nextPageStart - top + 8;
        const current = parseFloat(el.style.marginTop || '0') || 0;
        el.style.marginTop = `${current + extraPx + baseMargin}px`;
      }
    };
    const tryPushAcross = (id: string, baseMargin = 24) => {
      const el = node.querySelector(`#${id}`) as HTMLElement | null;
      if (el) pushElement(el, baseMargin);
    };
    // Generic: any element with data-keep also avoids breaks
    node.querySelectorAll<HTMLElement>('[data-keep="1"]').forEach((el) => pushElement(el, 8));
    tryPushAcross('prop-financ-block', 8);
    tryPushAcross('prop-suporte-block', 8);
    tryPushAcross('prop-aceite-block', 12);

    const oncloneFix = (_doc: Document, el: HTMLElement) => {
      el.querySelectorAll<HTMLElement>('*').forEach((n) => {
        n.style.wordSpacing = '0px';
        n.style.letterSpacing = 'normal';
        if (n.style.textAlign === 'justify') n.style.textAlign = 'left';
      });
    };
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, allowTaint: true, foreignObjectRendering: false, onclone: oncloneFix });
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
    return pdf;
  } finally {
    document.body.removeChild(wrap);
  }
}

export async function downloadCommercialProposalPdf(data: CommercialProposalPdfData) {
  const pdf = await buildPdf(data);
  const suffix = data.template === 'modelo02' ? '_Modelo02' : '';
  const filename = `Proposta_${data.proposalNumber}${suffix}.pdf`;
  try {
    const blob: Blob = pdf.output('blob');
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 4000);
  } catch (e) {
    // Fallback to jsPDF's built-in save (handles older browsers)
    pdf.save(filename);
  }
}

export async function previewCommercialProposalPdf(data: CommercialProposalPdfData): Promise<string[]> {
  const template: ProposalTemplate = data.template || 'modelo01';
  const validationUrl = data.validationUrl
    || `${window.location.origin}/validar-proposta/${data.integrityHash}`;
  let qrCodeDataUrl = data.qrCodeDataUrl;
  if (template === 'modelo01' && !qrCodeDataUrl) {
    try {
      qrCodeDataUrl = await QRCode.toDataURL(validationUrl, {
        margin: 1, width: 220, errorCorrectionLevel: 'M',
        color: { dark: '#0a1f44', light: '#ffffff' },
      });
    } catch {}
  }
  const html = template === 'modelo02'
    ? buildHtmlMinimal({ ...data, qrCodeDataUrl, validationUrl })
    : buildHtml({ ...data, qrCodeDataUrl, validationUrl });
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
    const pushElement = (el: HTMLElement, baseMargin: number) => {
      const top = el.offsetTop;
      const bottom = top + el.offsetHeight;
      const startPage = Math.floor(top / pageHeightPx);
      const endPage = Math.floor((bottom - 1) / pageHeightPx);
      if (endPage > startPage && el.offsetHeight < pageHeightPx - 40) {
        const nextPageStart = (startPage + 1) * pageHeightPx;
        const extraPx = nextPageStart - top + 8;
        const current = parseFloat(el.style.marginTop || '0') || 0;
        el.style.marginTop = `${current + extraPx + baseMargin}px`;
      }
    };
    const tryPushAcross = (id: string, baseMargin = 24) => {
      const el = node.querySelector(`#${id}`) as HTMLElement | null;
      if (el) pushElement(el, baseMargin);
    };
    node.querySelectorAll<HTMLElement>('[data-keep="1"]').forEach((el) => pushElement(el, 8));
    tryPushAcross('prop-financ-block', 8);
    tryPushAcross('prop-suporte-block', 8);
    tryPushAcross('prop-aceite-block', 12);

    const oncloneFix2 = (_doc: Document, el: HTMLElement) => {
      el.querySelectorAll<HTMLElement>('*').forEach((n) => {
        n.style.wordSpacing = '0px';
        n.style.letterSpacing = 'normal';
        if (n.style.textAlign === 'justify') n.style.textAlign = 'left';
      });
    };
    const canvas = await html2canvas(node, { scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false, allowTaint: true, foreignObjectRendering: false, onclone: oncloneFix2 });
    const slicePxPerMM = canvas.width / pageWidthMM;
    const slicePageH = Math.round(pageHeightMM * slicePxPerMM);
    const pages: string[] = [];
    for (let y = 0; y < canvas.height; y += slicePageH) {
      const h = Math.min(slicePageH, canvas.height - y);
      const slice = document.createElement('canvas');
      slice.width = canvas.width;
      slice.height = h;
      const ctx = slice.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, slice.width, slice.height);
      ctx.drawImage(canvas, 0, y, canvas.width, h, 0, 0, canvas.width, h);
      pages.push(slice.toDataURL('image/jpeg', 0.85));
    }
    return pages;
  } finally {
    document.body.removeChild(wrap);
  }
}
