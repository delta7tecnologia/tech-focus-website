// Validação de CNPJ e CPF brasileiros (com dígitos verificadores)

export const onlyDigits = (s: string) => (s || '').replace(/\D/g, '');

export const formatCpf = (digits: string) =>
  digits
    .padStart(11, '0')
    .slice(0, 11)
    .replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

export const formatCnpj = (digits: string) =>
  digits
    .padStart(14, '0')
    .slice(0, 14)
    .replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');

export const formatDocument = (raw: string) => {
  const d = onlyDigits(raw);
  if (d.length === 11) return formatCpf(d);
  if (d.length === 14) return formatCnpj(d);
  return raw;
};

const isAllSameDigit = (d: string) => /^(\d)\1+$/.test(d);

export const isValidCpf = (raw: string): boolean => {
  const d = onlyDigits(raw);
  if (d.length !== 11 || isAllSameDigit(d)) return false;
  const calc = (slice: string, start: number) => {
    let sum = 0;
    for (let i = 0; i < slice.length; i++) sum += parseInt(slice[i], 10) * (start - i);
    const r = (sum * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return calc(d.slice(0, 9), 10) === parseInt(d[9], 10) && calc(d.slice(0, 10), 11) === parseInt(d[10], 10);
};

export const isValidCnpj = (raw: string): boolean => {
  const d = onlyDigits(raw);
  if (d.length !== 14 || isAllSameDigit(d)) return false;
  const calc = (slice: string) => {
    const w = slice.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < slice.length; i++) sum += parseInt(slice[i], 10) * w[i];
    const r = sum % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return calc(d.slice(0, 12)) === parseInt(d[12], 10) && calc(d.slice(0, 13)) === parseInt(d[13], 10);
};

export type DocumentValidation = {
  valid: boolean;
  empty: boolean;
  type: 'cpf' | 'cnpj' | 'unknown';
  message: string | null;
  normalized: string; // somente dígitos
};

export const validateDocument = (raw: string): DocumentValidation => {
  const d = onlyDigits(raw);
  if (!d) return { valid: true, empty: true, type: 'unknown', message: null, normalized: '' };
  if (d.length === 11) {
    return {
      valid: isValidCpf(d),
      empty: false,
      type: 'cpf',
      normalized: d,
      message: isValidCpf(d) ? null : 'CPF inválido. Verifique os dígitos.',
    };
  }
  if (d.length === 14) {
    return {
      valid: isValidCnpj(d),
      empty: false,
      type: 'cnpj',
      normalized: d,
      message: isValidCnpj(d) ? null : 'CNPJ inválido. Verifique os dígitos.',
    };
  }
  return {
    valid: false,
    empty: false,
    type: 'unknown',
    normalized: d,
    message: 'Documento deve ter 11 dígitos (CPF) ou 14 dígitos (CNPJ).',
  };
};
