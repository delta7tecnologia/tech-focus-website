import { fetchAssetLicenses } from '@/lib/assetLicenses';
import { formatLicenseTitle, getCategoryLabel, type AssetLicense, LICENSE_CATALOG } from '@/lib/licenseCatalog';
import { DELTA7_LOGO_DATA_URL, DELTA7_LOGO_DARK_DATA_URL } from '@/assets/delta7LogoBase64';
import { getProductLogo } from '@/assets/productLogos';

interface AssetForReport {
  id: string;
  machine_name: string;
  company_name: string;
  notes: string | null;
}

export interface ReportClientInfo {
  company_name: string;
  document?: string;
  contact_person?: string;
  address?: string;
}

const formatDate = (d: string | null) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
};

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));

const renderLicenseRow = (l: AssetLicense) => `
  <tr>
    <td class="lic-cat">${escapeHtml(getCategoryLabel(l.category))}</td>
    <td class="lic-prod">${escapeHtml(formatLicenseTitle(l))}</td>
    <td class="lic-date">${l.activation_date ? formatDate(l.activation_date) : '—'}</td>
    <td class="lic-key">${l.license_key ? `<code>${escapeHtml(l.license_key)}</code>` : '—'}</td>
  </tr>
  ${l.notes ? `<tr class="lic-notes-row"><td colspan="4"><span>Obs.:</span> ${escapeHtml(l.notes)}</td></tr>` : ''}
`;

const renderAssetCard = (
  a: AssetForReport,
  index: number,
  licenses: AssetLicense[],
) => `
  <section class="asset-card">
    <header class="asset-header">
      <div class="asset-num">#${String(index + 1).padStart(2, '0')}</div>
      <div class="asset-title">
        <h2>${escapeHtml(a.machine_name)}</h2>
        <p>${escapeHtml(a.company_name)}</p>
      </div>
      <div class="asset-badge">${licenses.length} licença${licenses.length === 1 ? '' : 's'}</div>
    </header>

    ${
      licenses.length
        ? `<table class="lic-table">
            <thead>
              <tr><th>Categoria</th><th>Produto</th><th>Ativação</th><th>Chave</th></tr>
            </thead>
            <tbody>${licenses.map(renderLicenseRow).join('')}</tbody>
          </table>`
        : `<div class="empty">Nenhuma licença registrada para este equipamento.</div>`
    }

    ${
      a.notes
        ? `<div class="asset-notes"><strong>Observações:</strong> ${escapeHtml(a.notes)}</div>`
        : ''
    }
  </section>
`;

export const printAssetReport = async (
  assets: AssetForReport[],
  companyName: string,
  clientInfo?: ReportClientInfo,
) => {
  const client: ReportClientInfo = clientInfo || { company_name: companyName };
  const grouped = await fetchAssetLicenses(assets.map((a) => a.id));

  // Resumo executivo: contagem por categoria
  const categoryCounts = new Map<string, number>();
  let totalLicenses = 0;
  for (const a of assets) {
    for (const l of grouped[a.id] || []) {
      categoryCounts.set(l.category, (categoryCounts.get(l.category) || 0) + 1);
      totalLicenses++;
    }
  }
  const summaryRows = LICENSE_CATALOG
    .map((c) => ({ label: c.label, count: categoryCounts.get(c.value) || 0 }))
    .filter((r) => r.count > 0);

  const today = new Date();
  const dateStr = today.toLocaleDateString('pt-BR');
  const timeStr = today.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const reportId = `INV-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(today.getHours()).padStart(2, '0')}${String(today.getMinutes()).padStart(2, '0')}`;

  const cards = assets
    .map((a, i) => renderAssetCard(a, i, grouped[a.id] || []))
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <title>Relatório de Inventário — ${escapeHtml(companyName)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --primary: #1e40af;
      --primary-light: #2563eb;
      --accent: #0ea5e9;
      --text: #0f172a;
      --muted: #64748b;
      --border: #e2e8f0;
      --bg-soft: #f8fafc;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
      font-size: 11px;
      color: var(--text);
      background: white;
      line-height: 1.5;
    }

    /* ===== CAPA ===== */
    .cover {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 60px 50px;
      background: linear-gradient(135deg, #0f172a 0%, #1e40af 100%);
      color: white;
      page-break-after: always;
    }
    .cover-top { display: flex; justify-content: space-between; align-items: flex-start; }
    .cover-logo {
      height: 80px;
      width: auto;
      object-fit: contain;
    }
    .cover-id {
      font-size: 10px;
      letter-spacing: 2px;
      opacity: 0.7;
      text-align: right;
      font-family: 'Courier New', monospace;
    }
    .cover-main { flex: 1; display: flex; flex-direction: column; justify-content: center; }
    .cover-eyebrow {
      font-size: 12px;
      letter-spacing: 6px;
      text-transform: uppercase;
      opacity: 0.7;
      margin-bottom: 16px;
    }
    .cover-title {
      font-size: 52px;
      font-weight: 800;
      letter-spacing: -1px;
      line-height: 1.05;
      margin-bottom: 12px;
    }
    .cover-subtitle {
      font-size: 16px;
      opacity: 0.85;
      max-width: 600px;
    }
    .cover-divider {
      width: 80px;
      height: 4px;
      background: var(--accent);
      margin: 32px 0;
    }
    .cover-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      padding-top: 32px;
      border-top: 1px solid rgba(255,255,255,0.2);
    }
    .cover-meta-item .label {
      font-size: 10px;
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.6;
      margin-bottom: 6px;
    }
    .cover-meta-item .value { font-size: 16px; font-weight: 600; }
    .cover-footer {
      font-size: 10px;
      opacity: 0.6;
      text-align: center;
      letter-spacing: 1px;
    }

    /* ===== HEADER PÁGINAS INTERNAS ===== */
    .page { padding: 30px 40px; }
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 12px;
      border-bottom: 2px solid var(--primary);
      margin-bottom: 20px;
    }
    .page-header img { height: 44px; width: auto; object-fit: contain; }
    .page-header .ph-info {
      text-align: right;
      font-size: 10px;
      color: var(--muted);
    }
    .page-header .ph-info strong { color: var(--text); display: block; font-size: 11px; }

    /* ===== AVISO LEGAL (CAPA) ===== */
    .legal-cover {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 8px;
      padding: 14px 18px;
      margin-top: 24px;
      font-size: 9.5px;
      line-height: 1.55;
      color: rgba(255,255,255,0.85);
    }
    .legal-cover strong { color: white; letter-spacing: 1px; font-size: 9px; text-transform: uppercase; display: block; margin-bottom: 4px; }

    /* ===== AVISO LEGAL (RODAPÉ) ===== */
    .legal-footer {
      margin-top: 18px;
      padding: 12px 14px;
      border: 1px solid var(--border);
      border-left: 3px solid var(--primary);
      background: var(--bg-soft);
      font-size: 9px;
      line-height: 1.5;
      color: var(--muted);
      border-radius: 4px;
    }
    .legal-footer strong { color: var(--text); display: block; margin-bottom: 3px; font-size: 9.5px; text-transform: uppercase; letter-spacing: 0.5px; }

    /* ===== CARTÃO DE DADOS DO CLIENTE (CAPA) ===== */
    .client-card {
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.18);
      border-radius: 8px;
      padding: 18px 22px;
      margin-top: 28px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px 24px;
    }
    .client-card .field .lbl {
      font-size: 9px; letter-spacing: 1.5px; opacity: 0.55;
      text-transform: uppercase; margin-bottom: 3px;
    }
    .client-card .field .val { font-size: 13px; font-weight: 600; word-wrap: break-word; }
    .client-card .field.full { grid-column: 1 / -1; }

    /* ===== RESUMO ===== */
    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin: 24px 0 12px;
      padding-left: 10px;
      border-left: 4px solid var(--primary);
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .summary-card {
      background: var(--bg-soft);
      border: 1px solid var(--border);
      border-radius: 6px;
      padding: 14px;
      border-left: 4px solid var(--primary-light);
    }
    .summary-card .num {
      font-size: 26px;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
    }
    .summary-card .lbl {
      font-size: 10px;
      color: var(--muted);
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-top: 4px;
    }
    .cat-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 8px;
      font-size: 11px;
    }
    .cat-table th {
      background: var(--bg-soft);
      color: var(--muted);
      padding: 8px 12px;
      text-align: left;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid var(--border);
    }
    .cat-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
    }
    .cat-table td:last-child {
      text-align: right;
      font-weight: 700;
      color: var(--primary);
    }

    /* ===== CARDS DE ATIVO ===== */
    .asset-card {
      border: 1px solid var(--border);
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;
      page-break-inside: avoid;
      background: white;
    }
    .asset-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 16px;
      background: linear-gradient(90deg, var(--primary) 0%, var(--primary-light) 100%);
      color: white;
    }
    .asset-num {
      font-size: 18px;
      font-weight: 800;
      opacity: 0.6;
      font-family: 'Courier New', monospace;
    }
    .asset-title { flex: 1; }
    .asset-title h2 { font-size: 15px; font-weight: 700; line-height: 1.2; }
    .asset-title p { font-size: 11px; opacity: 0.85; }
    .asset-badge {
      background: rgba(255,255,255,0.2);
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }

    .lic-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10.5px;
    }
    .lic-table th {
      background: var(--bg-soft);
      color: var(--muted);
      padding: 6px 12px;
      text-align: left;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-bottom: 1px solid var(--border);
    }
    .lic-table td {
      padding: 8px 12px;
      border-bottom: 1px solid var(--border);
      vertical-align: top;
    }
    .lic-table tr:last-child td { border-bottom: none; }
    .lic-cat { color: var(--muted); white-space: nowrap; width: 110px; }
    .lic-prod { font-weight: 600; color: var(--text); }
    .lic-date { color: var(--muted); white-space: nowrap; width: 80px; }
    .lic-key code {
      font-family: 'Courier New', monospace;
      font-size: 10px;
      background: var(--bg-soft);
      padding: 2px 6px;
      border-radius: 3px;
      word-break: break-all;
      color: var(--primary);
    }
    .lic-notes-row td {
      background: #fffbeb;
      font-size: 10px;
      color: #92400e;
      padding: 6px 12px;
    }
    .lic-notes-row span { font-weight: 700; }

    .asset-notes {
      padding: 10px 16px;
      background: var(--bg-soft);
      font-size: 10.5px;
      color: var(--muted);
      border-top: 1px solid var(--border);
    }
    .asset-notes strong { color: var(--text); }
    .empty {
      padding: 16px;
      text-align: center;
      color: var(--muted);
      font-style: italic;
      font-size: 10.5px;
    }

    /* ===== FOOTER ===== */
    .doc-footer {
      margin-top: 28px;
      padding-top: 14px;
      border-top: 1px solid var(--border);
      text-align: center;
      font-size: 9px;
      color: var(--muted);
      letter-spacing: 0.5px;
    }
    .doc-footer strong { color: var(--primary); }

    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      @page { size: A4; margin: 0; }
      .page { padding: 25mm 18mm; }
      .cover { padding: 25mm 18mm; }
      .asset-card { page-break-inside: avoid; }
    }
  </style>
</head>
<body>

  <!-- ========= CAPA ========= -->
  <div class="cover">
    <div class="cover-top">
      <img src="${DELTA7_LOGO_DATA_URL}" class="cover-logo" alt="Delta7 Tecnologia">
      <div class="cover-id">${reportId}</div>
    </div>

    <div class="cover-main">
      <div class="cover-eyebrow">Relatório Técnico</div>
      <div class="cover-title">Inventário de TI</div>
      <div class="cover-divider"></div>
      <div class="cover-subtitle">Documento técnico contendo o levantamento completo de ativos, licenças de software e configurações dos equipamentos sob gestão.</div>

      <div class="client-card">
        <div class="field full">
          <div class="lbl">Cliente</div>
          <div class="val">${escapeHtml(client.company_name || companyName)}</div>
        </div>
        ${client.document ? `<div class="field"><div class="lbl">CNPJ / CPF</div><div class="val">${escapeHtml(client.document)}</div></div>` : ''}
        ${client.contact_person ? `<div class="field"><div class="lbl">Responsável</div><div class="val">${escapeHtml(client.contact_person)}</div></div>` : ''}
        ${client.address ? `<div class="field full"><div class="lbl">Endereço</div><div class="val">${escapeHtml(client.address)}</div></div>` : ''}
      </div>

      <div class="cover-meta">
        <div class="cover-meta-item">
          <div class="label">Equipamentos</div>
          <div class="value">${assets.length}</div>
        </div>
        <div class="cover-meta-item">
          <div class="label">Licenças</div>
          <div class="value">${totalLicenses}</div>
        </div>
        <div class="cover-meta-item">
          <div class="label">Emissão</div>
          <div class="value">${dateStr} · ${timeStr}</div>
        </div>
      </div>

      <div class="legal-cover">
        <strong>Aviso legal · Confidencialidade</strong>
        Este documento é de propriedade da <b>Delta7 Tecnologia</b> e contém informações técnicas e licenças de software vinculadas ao cliente identificado acima. Sua reprodução, divulgação, transferência a terceiros ou utilização para fins distintos da gestão de TI contratada é expressamente proibida sem autorização formal por escrito. Os dados aqui registrados refletem o levantamento na data de emissão e podem sofrer alterações.
      </div>
    </div>

    <div class="cover-footer">DELTA7 TECNOLOGIA · GESTÃO DE TI E INFRAESTRUTURA · DOCUMENTO CONFIDENCIAL</div>
  </div>

  <!-- ========= CORPO ========= -->
  <div class="page">
    <div class="page-header">
      <img src="${DELTA7_LOGO_DARK_DATA_URL}" alt="Delta7">
      <div class="ph-info">
        <strong>${escapeHtml(client.company_name || companyName)}</strong>
        Inventário de TI · ${dateStr} · ${reportId}
      </div>
    </div>

    <!-- Resumo executivo -->
    <div class="section-title">Resumo Executivo</div>
    <div class="summary-grid">
      <div class="summary-card">
        <div class="num">${assets.length}</div>
        <div class="lbl">Equipamentos</div>
      </div>
      <div class="summary-card">
        <div class="num">${totalLicenses}</div>
        <div class="lbl">Licenças totais</div>
      </div>
      <div class="summary-card">
        <div class="num">${summaryRows.length}</div>
        <div class="lbl">Categorias de software</div>
      </div>
    </div>

    ${
      summaryRows.length
        ? `<table class="cat-table">
            <thead><tr><th>Categoria</th><th style="text-align:right">Quantidade</th></tr></thead>
            <tbody>
              ${summaryRows.map((r) => `<tr><td>${escapeHtml(r.label)}</td><td>${r.count}</td></tr>`).join('')}
            </tbody>
          </table>`
        : ''
    }

    <!-- Detalhamento -->
    <div class="section-title">Detalhamento por Equipamento</div>
    ${cards}

    <div class="legal-footer">
      <strong>Aviso legal e política de uso</strong>
      As informações contidas neste relatório, incluindo chaves de licença, dados de equipamentos e identificação do cliente, são <b>confidenciais</b> e de uso restrito. Os softwares listados foram comercializados/instalados pela Delta7 Tecnologia conforme contrato de prestação de serviços de TI vigente. O cliente é responsável pela guarda das licenças, pelo uso em conformidade com os termos dos respectivos fabricantes (Microsoft EULA, Kaspersky, etc.) e pelo cumprimento da Lei de Software (Lei nº 9.609/98) e da LGPD (Lei nº 13.709/18). A Delta7 Tecnologia não se responsabiliza por uso indevido, transferências não autorizadas ou alterações realizadas após a emissão deste documento.
    </div>

    <div class="doc-footer">
      <strong>Delta7 Tecnologia</strong> · Documento confidencial gerado automaticamente em ${dateStr} às ${timeStr} · ID ${reportId}<br>
      Distribuição restrita ao cliente identificado na capa.
    </div>
  </div>

  <script>window.onload = function() { setTimeout(function(){ window.print(); }, 300); }</script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
