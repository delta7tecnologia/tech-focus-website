export type SignatureRole = 'tecnico' | 'gestor' | 'usuario';

export interface SignatureHistoryEntry {
  id: string;
  role: SignatureRole;
  roleLabel: string;
  signerName: string;
  signedAt: string;
  versionBefore: number;
  versionAfter: number;
  action: 'signed' | 'updated_signature';
  reportNumber: string;
  previousHash?: string;
  nextHash?: string;
}

const ROLES: Array<{ role: SignatureRole; label: string; field: string }> = [
  { role: 'tecnico', label: 'Técnico Responsável', field: 'assinaturaTecnico' },
  { role: 'gestor', label: 'Gestor / Supervisor', field: 'assinaturaGestor' },
  { role: 'usuario', label: 'Usuário do Equipamento', field: 'assinaturaUsuario' },
];

export const normalizeSignatureHistory = (value: unknown): SignatureHistoryEntry[] =>
  Array.isArray(value) ? value.filter(Boolean) as SignatureHistoryEntry[] : [];

export const getDocumentVersion = (history: SignatureHistoryEntry[]) =>
  history.reduce((max, item) => Math.max(max, Number(item.versionAfter) || 0), 1);

const getSignerName = (role: SignatureRole, form: any, fallbackTechnicianName: string) => {
  if (role === 'tecnico') return form.technicianName || fallbackTechnicianName || 'Técnico Responsável';
  if (role === 'gestor') return form.gestorNome || 'Gestor / Supervisor';
  return form.usuarioNome || form.usuario || 'Usuário do Equipamento';
};

export function appendSignatureHistory(params: {
  previousForm?: any;
  nextForm: any;
  existingHistory: SignatureHistoryEntry[];
  reportNumber: string;
  signedAt: string;
  technicianName: string;
  previousHash?: string;
  nextHash?: string;
}) {
  const history = [...params.existingHistory];
  let version = getDocumentVersion(history);

  for (const item of ROLES) {
    const before = params.previousForm?.[item.field] || '';
    const after = params.nextForm?.[item.field] || '';
    if (!after || after === before) continue;

    history.push({
      id: crypto.randomUUID(),
      role: item.role,
      roleLabel: item.label,
      signerName: getSignerName(item.role, params.nextForm, params.technicianName),
      signedAt: params.signedAt,
      versionBefore: version,
      versionAfter: version + 1,
      action: before ? 'updated_signature' : 'signed',
      reportNumber: params.reportNumber,
      previousHash: params.previousHash,
      nextHash: params.nextHash,
    });
    version += 1;
  }

  return history;
}

export const formatSignatureDate = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });