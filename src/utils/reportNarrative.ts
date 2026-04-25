/**
 * Converte respostas curtas do formulário em texto narrativo profissional
 * para o laudo técnico.
 */

export function narrateEstadoGeral(estado: string): string {
  switch (estado) {
    case 'Bom':
      return 'O equipamento foi recebido em bom estado de conservação aparente, sem danos físicos visíveis.';
    case 'Regular':
      return 'O equipamento foi recebido em estado regular, apresentando sinais de uso compatíveis com o tempo de operação.';
    case 'Crítico':
      return 'Constatou-se que o equipamento foi recebido em estado crítico, apresentando sinais evidentes de comprometimento físico ou funcional.';
    default:
      return '';
  }
}

export function narrateLacre(lacre: string): string {
  if (lacre === 'Sim') {
    return 'Constatou-se a violação do selo de garantia original, o que pode implicar a perda da cobertura do fabricante.';
  }
  if (lacre === 'Não') {
    return 'Os selos de garantia originais encontram-se íntegros, sem indícios de violação prévia.';
  }
  return '';
}

export function narrateStatusFinal(status: string): string {
  switch (status) {
    case 'Resolvido':
      return 'Após análise técnica, o equipamento teve sua operação plenamente restabelecida e foi liberado para uso normal.';
    case 'Pendente':
      return 'O atendimento encontra-se pendente, dependendo da aquisição de peças, autorização do cliente ou complemento de diagnóstico.';
    case 'Condenado':
      return 'Após análise técnica detalhada, o equipamento foi considerado CONDENADO, sendo tecnicamente inviável ou economicamente desfavorável a continuidade do reparo.';
    default:
      return '';
  }
}

export function escapeHtml(s: string): string {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br/>');
}
