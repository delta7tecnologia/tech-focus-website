// Render helper para a seção "Clientes que confiam na Delta7" nos PDFs das propostas.
import { escapeHtml } from './reportNarrative';

export interface FeaturedClientPdf {
  id: string;
  name: string;
  logo_url?: string | null;
  website_url?: string | null;
}

interface ColorsModelo01 {
  navy: string;
  gold: string;
  cream: string;
  ink: string;
  muted: string;
  paper: string;
}

const clientCard = (c: FeaturedClientPdf, colors: ColorsModelo01) => {
  const inner = c.logo_url
    ? `<img src="${escapeHtml(c.logo_url)}" alt="${escapeHtml(c.name)}" style="max-height:40px;max-width:100%;object-fit:contain;display:block;margin:0 auto;" crossorigin="anonymous" />`
    : `<div style="font-size:11px;font-weight:800;color:${colors.navy};letter-spacing:0.3px;line-height:1.2;text-align:center;padding:6px 4px;">${escapeHtml(c.name)}</div>`;
  return `
    <td style="width:20%;padding:6px;vertical-align:middle;">
      <div style="background:white;border:1px solid #e7e2d2;border-radius:6px;padding:14px 8px;height:70px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;">
        ${inner}
      </div>
    </td>`;
};

export const renderFeaturedClientsModelo01 = (
  clients: FeaturedClientPdf[] | undefined,
  colors: ColorsModelo01,
  sectionTitle: (eyebrow: string, title: string, mt?: number) => string,
): string => {
  if (!clients || clients.length === 0) return '';
  // Build rows of 5
  const rows: FeaturedClientPdf[][] = [];
  for (let i = 0; i < clients.length; i += 5) rows.push(clients.slice(i, i + 5));
  const rowHtml = rows
    .map((row) => {
      const padded = [...row];
      while (padded.length < 5) padded.push(null as any);
      return `<tr>${padded.map((c) => (c ? clientCard(c, colors) : '<td style="width:20%;"></td>')).join('')}</tr>`;
    })
    .join('');
  return `
    <div data-keep="1">
      ${sectionTitle('Confiança', 'Clientes que confiam na Delta7')}
      <p style="margin:0 0 12px 0;font-size:10.5px;color:${colors.muted};line-height:1.55;">
        Algumas das empresas que confiam na Delta7 para gestão e suporte de TI:
      </p>
      <table style="width:100%;border-collapse:separate;border-spacing:0;">
        ${rowHtml}
      </table>
    </div>`;
};

interface ColorsModelo02 {
  navy: string;
  ink: string;
  muted: string;
  line: string;
}

export const renderFeaturedClientsModelo02 = (
  clients: FeaturedClientPdf[] | undefined,
  colors: ColorsModelo02,
  sectionNumber: string,
  section: (eb: string, title: string, body: string, mt?: number) => string,
): string => {
  if (!clients || clients.length === 0) return '';
  const rows: FeaturedClientPdf[][] = [];
  for (let i = 0; i < clients.length; i += 5) rows.push(clients.slice(i, i + 5));
  const cardHtml = (c: FeaturedClientPdf) => {
    const inner = c.logo_url
      ? `<img src="${escapeHtml(c.logo_url)}" alt="${escapeHtml(c.name)}" style="max-height:36px;max-width:100%;object-fit:contain;display:block;margin:0 auto;" crossorigin="anonymous" />`
      : `<div style="font-size:11px;font-weight:600;color:${colors.navy};text-align:center;line-height:1.2;">${escapeHtml(c.name)}</div>`;
    return `<td style="width:20%;padding:10px 8px;vertical-align:middle;border-bottom:1px solid ${colors.line};">
      <div style="height:48px;display:flex;align-items:center;justify-content:center;">${inner}</div>
    </td>`;
  };
  const rowHtml = rows
    .map((row) => {
      const padded = [...row];
      while (padded.length < 5) padded.push(null as any);
      return `<tr>${padded
        .map((c) => (c ? cardHtml(c) : `<td style="width:20%;border-bottom:1px solid ${colors.line};"></td>`))
        .join('')}</tr>`;
    })
    .join('');
  const body = `
    <p style="margin:0 0 14px 0;font-size:11px;color:${colors.muted};line-height:1.6;">
      Algumas das empresas que confiam na Delta7 para gestão e suporte de TI.
    </p>
    <table style="width:100%;border-collapse:collapse;border-top:1px solid ${colors.line};">
      ${rowHtml}
    </table>`;
  return section(sectionNumber, 'Clientes que confiam na Delta7', body);
};
