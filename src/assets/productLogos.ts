// Logos oficiais (SVG inline, data URI) dos produtos comercializados pela Delta7.
// Usados no relatório de inventário para identificar visualmente cada licença.
// SVGs simplificados representando as marcas oficiais — evita CORS e mantém o PDF leve.

const svgToDataUri = (svg: string): string =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;

// Microsoft Windows logo (4 quadrados)
const WINDOWS_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <rect x="0" y="0" width="40" height="40" fill="#F25022"/>
  <rect x="48" y="0" width="40" height="40" fill="#7FBA00"/>
  <rect x="0" y="48" width="40" height="40" fill="#00A4EF"/>
  <rect x="48" y="48" width="40" height="40" fill="#FFB900"/>
</svg>`;

// Windows Server (logo Windows com tom azul)
const WINDOWS_SERVER_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <rect x="0" y="0" width="40" height="40" fill="#0078D4"/>
  <rect x="48" y="0" width="40" height="40" fill="#106EBE"/>
  <rect x="0" y="48" width="40" height="40" fill="#005A9E"/>
  <rect x="48" y="48" width="40" height="40" fill="#004578"/>
</svg>`;

// Microsoft Office (laranja/vermelho)
const OFFICE_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <path d="M8 18 L52 6 L80 16 L80 72 L52 82 L8 70 Z" fill="#D83B01"/>
  <path d="M52 6 L52 82 L80 72 L80 16 Z" fill="#EB3C00"/>
  <text x="30" y="58" font-family="Arial, sans-serif" font-size="34" font-weight="bold" fill="#FFFFFF">O</text>
</svg>`;

// Microsoft 365 (gradiente)
const M365_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <defs>
    <linearGradient id="m365g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#CA64EA"/>
      <stop offset="50%" stop-color="#EA1A6F"/>
      <stop offset="100%" stop-color="#F58220"/>
    </linearGradient>
  </defs>
  <path d="M14 14 L74 14 L74 64 L44 80 L14 64 Z" fill="url(#m365g)"/>
  <text x="20" y="56" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#FFFFFF">365</text>
</svg>`;

// CAL / RDS (chave)
const CAL_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <circle cx="28" cy="44" r="18" fill="none" stroke="#0078D4" stroke-width="8"/>
  <rect x="44" y="40" width="38" height="8" fill="#0078D4"/>
  <rect x="66" y="40" width="8" height="16" fill="#0078D4"/>
  <rect x="76" y="40" width="6" height="12" fill="#0078D4"/>
</svg>`;

// Kaspersky (verde/preto)
const KASPERSKY_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <circle cx="44" cy="44" r="40" fill="#1A1A1A"/>
  <path d="M44 14 C30 14 22 24 22 36 C22 48 30 52 38 56 C46 60 52 62 52 70 C52 76 48 78 44 78 C40 78 36 76 36 70 L24 70 C24 80 32 88 44 88 C56 88 64 80 64 70 C64 58 56 54 48 50 C40 46 34 44 34 36 C34 30 38 28 42 28 C46 28 50 30 50 36 L62 36 C62 24 54 14 44 14 Z" fill="#00A88E"/>
</svg>`;

// Genérico (escudo) para "outro"
const GENERIC_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 88 88">
  <path d="M44 8 L74 20 L74 48 C74 64 60 76 44 80 C28 76 14 64 14 48 L14 20 Z" fill="#64748B"/>
  <path d="M32 44 L40 52 L58 34" stroke="#FFFFFF" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

const LOGOS = {
  windows: svgToDataUri(WINDOWS_SVG),
  windows_server: svgToDataUri(WINDOWS_SERVER_SVG),
  office: svgToDataUri(OFFICE_SVG),
  m365: svgToDataUri(M365_SVG),
  cal_rds: svgToDataUri(CAL_SVG),
  antivirus: svgToDataUri(KASPERSKY_SVG),
  outro: svgToDataUri(GENERIC_SVG),
};

/**
 * Resolve a logo de um produto baseado na categoria e/ou nome.
 * Faz match heurístico no nome do produto (ex.: "Kaspersky", "Office").
 */
export const getProductLogo = (category: string, product?: string): string => {
  const p = (product || '').toLowerCase();

  // Heurística por nome (sobrepõe categoria genérica)
  if (p.includes('kaspersky')) return LOGOS.antivirus;
  if (p.includes('windows server') || p.includes('server 20')) return LOGOS.windows_server;
  if (p.includes('windows')) return LOGOS.windows;
  if (p.includes('365')) return LOGOS.m365;
  if (p.includes('office')) return LOGOS.office;
  if (p.includes('cal') || p.includes('rds')) return LOGOS.cal_rds;

  // Fallback por categoria
  return (LOGOS as Record<string, string>)[category] || LOGOS.outro;
};
