import { describe, expect, test } from 'bun:test';
import { safePageEnd } from './itSupportPagination';

describe('Quebras da proposta de suporte de TI', () => {
  test('não corta uma linha da tabela no limite da página', () => {
    expect(safePageEnd(0, 1000, [{ top: 980, bottom: 1020 }])).toBe(980);
  });
  test('mantém blocos sobrepostos inteiros', () => {
    expect(safePageEnd(0, 1000, [{ top: 900, bottom: 1050 }, { top: 850, bottom: 920 }])).toBe(850);
  });
  test('divide texto longo entre linhas completas', () => {
    expect(safePageEnd(1000, 2000, [{ top: 1988, bottom: 2006 }])).toBe(1988);
  });
  test('permite a quebra exatamente entre dois blocos', () => {
    expect(safePageEnd(0, 1000, [{ top: 900, bottom: 1000 }, { top: 1000, bottom: 1100 }])).toBe(1000);
  });
});