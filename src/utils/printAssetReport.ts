import { fetchAssetLicenses } from '@/lib/assetLicenses';
import { formatLicenseTitle, getCategoryLabel, type AssetLicense } from '@/lib/licenseCatalog';

interface AssetForReport {
  id: string;
  machine_name: string;
  company_name: string;
  notes: string | null;
}

const formatDate = (d: string | null) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
};

const renderLicenses = (licenses: AssetLicense[]) => {
  if (!licenses.length) return '<span style="color:#9ca3af;font-style:italic">Sem licenças</span>';
  return licenses
    .map(
      (l) => `
        <div style="margin-bottom:4px;padding-left:4px;border-left:2px solid #2563eb">
          <div style="font-size:11px"><strong>${getCategoryLabel(l.category)}:</strong> ${formatLicenseTitle(l)}</div>
          ${l.activation_date ? `<div style="font-size:10px;color:#6b7280">Ativação: ${formatDate(l.activation_date)}</div>` : ''}
          ${l.license_key ? `<div style="font-family:monospace;font-size:10px;word-break:break-all">${l.license_key}</div>` : ''}
          ${l.notes ? `<div style="font-size:10px;color:#6b7280">${l.notes}</div>` : ''}
        </div>`
    )
    .join('');
};

export const printAssetReport = async (assets: AssetForReport[], companyName: string) => {
  const grouped = await fetchAssetLicenses(assets.map((a) => a.id));

  const rows = assets
    .map(
      (a, i) => `
      <tr>
        <td style="vertical-align:top">${i + 1}</td>
        <td style="vertical-align:top"><strong>${a.machine_name}</strong></td>
        <td style="vertical-align:top">${a.company_name}</td>
        <td style="vertical-align:top">${renderLicenses(grouped[a.id] || [])}</td>
        <td style="vertical-align:top">${a.notes || '—'}</td>
      </tr>`
    )
    .join('');

  const today = new Date().toLocaleDateString('pt-BR');

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Relatório de Inventário - ${companyName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #333; padding: 20px; }
    .header { text-align: center; margin-bottom: 24px; border-bottom: 2px solid #2563eb; padding-bottom: 12px; }
    .header h1 { font-size: 18px; color: #1e40af; margin-bottom: 4px; }
    .header p { font-size: 12px; color: #6b7280; }
    .meta { display: flex; justify-content: space-between; margin-bottom: 16px; font-size: 12px; color: #6b7280; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #2563eb; color: white; padding: 8px 6px; text-align: left; font-size: 11px; }
    td { padding: 8px 6px; border-bottom: 1px solid #e5e7eb; font-size: 11px; }
    tr:nth-child(even) { background: #f9fafb; }
    .footer { margin-top: 24px; text-align: center; font-size: 10px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 8px; }
    @media print {
      body { padding: 0; }
      @page { margin: 15mm; size: landscape; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Relatório de Inventário de TI</h1>
    <p>${companyName}</p>
  </div>
  <div class="meta">
    <span>Total de máquinas: ${assets.length}</span>
    <span>Data: ${today}</span>
  </div>
  <table>
    <thead>
      <tr>
        <th style="width:30px">#</th>
        <th>Máquina</th>
        <th>Empresa</th>
        <th>Licenças</th>
        <th>Observações</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <div class="footer">
    Delta7 Tecnologia — Relatório gerado em ${today}
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
};
