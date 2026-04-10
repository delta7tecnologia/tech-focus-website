interface AssetForReport {
  machine_name: string;
  company_name: string;
  windows_activation_date: string | null;
  office_activation_date: string | null;
  windows_license: string | null;
  office_license: string | null;
  notes: string | null;
}

const formatDate = (d: string | null) => {
  if (!d) return '—';
  return new Date(d + 'T00:00:00').toLocaleDateString('pt-BR');
};

export const printAssetReport = (assets: AssetForReport[], companyName: string) => {
  const rows = assets
    .map(
      (a, i) => `
      <tr>
        <td>${i + 1}</td>
        <td>${a.machine_name}</td>
        <td>${formatDate(a.windows_activation_date)}</td>
        <td style="font-family:monospace;font-size:11px;word-break:break-all">${a.windows_license || '—'}</td>
        <td>${formatDate(a.office_activation_date)}</td>
        <td style="font-family:monospace;font-size:11px;word-break:break-all">${a.office_license || '—'}</td>
        <td>${a.notes || '—'}</td>
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
    td { padding: 6px; border-bottom: 1px solid #e5e7eb; font-size: 11px; vertical-align: top; }
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
        <th>#</th>
        <th>Máquina</th>
        <th>Ativação Windows</th>
        <th>Licença Windows</th>
        <th>Ativação Office</th>
        <th>Licença Office</th>
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
