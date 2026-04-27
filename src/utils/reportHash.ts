/**
 * Gera hash SHA-256 a partir do conteúdo do laudo + técnico + timestamp.
 * Usa Web Crypto API nativa (sem dependências).
 */
export async function generateReportHash(
  data: Record<string, unknown>,
  technicianName: string,
  timestampISO: string
): Promise<string> {
  const payload = JSON.stringify(data) + '|' + technicianName + '|' + timestampISO;
  const encoder = new TextEncoder();
  const buffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function sha256Hex(input: string): Promise<string> {
  const buffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input));
  return Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

export function generateReportNumber(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LDO-${yyyy}${mm}${dd}-${rand}`;
}
