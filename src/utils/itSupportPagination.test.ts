import { describe, test } from 'node:test';
import { strictEqual } from 'node:assert';
import { safePageEnd } from './itSupportPagination';

describe('Quebras da proposta de suporte de TI', () => {
  test('não corta uma linha da tabela no limite da página', () => {
    strictEqual(safePageEnd(0, 1000, [{ top: 980, bottom: 1020 }]), 980);
  });
  test('mantém blocos sobrepostos inteiros', () => {
    strictEqual(safePageEnd(0, 1000, [{ top: 900, bottom: 1050 }, { top: 850, bottom: 920 }]), 850);
  });
  test('divide texto longo entre linhas completas', () => {
    strictEqual(safePageEnd(1000, 2000, [{ top: 1988, bottom: 2006 }]), 1988);
  });
  test('permite a quebra exatamente entre dois blocos', () => {
    strictEqual(safePageEnd(0, 1000, [{ top: 900, bottom: 1000 }, { top: 1000, bottom: 1100 }]), 1000);
  });
});