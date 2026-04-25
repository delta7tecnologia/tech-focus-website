/**
 * Conversor de respostas curtas em frases formais para o laudo avançado
 * de equipamento (computador / estação de trabalho) — Delta7.
 */

export type SituacaoHW = 'Bom' | 'Regular' | 'Ruim' | '';

export function narrateHardware(componente: string, situacao: SituacaoHW): string {
  if (!situacao) return '';
  switch (situacao) {
    case 'Bom':
      return `${componente} encontra-se em pleno funcionamento, sem indícios de desgaste ou falha operacional.`;
    case 'Regular':
      return `${componente} apresenta sinais de uso compatíveis com o tempo de operação, recomendando-se monitoramento contínuo.`;
    case 'Ruim':
      return `${componente} apresenta desgaste acentuado, comprometendo a operação e exigindo intervenção corretiva.`;
  }
}

export function narrateSO(situacao: string): string {
  if (situacao === 'Original') return 'Sistema operacional devidamente licenciado, em conformidade com a política de uso do fabricante.';
  if (situacao === 'Pirata') return 'Constatou-se sistema operacional sem licenciamento original, situação que viola termos de uso e expõe a organização a riscos legais e de segurança.';
  return '';
}

export function narrateOffice(situacao: string): string {
  if (situacao === 'Licenciado') return 'Suíte de produtividade devidamente licenciada.';
  if (situacao === 'N/A') return 'Não há suíte de produtividade instalada ou não se aplica ao perfil de uso.';
  if (situacao === 'Pirata') return 'Suíte de produtividade sem licenciamento adequado — recomenda-se regularização imediata.';
  return '';
}

export function narrateAntivirus(situacao: string): string {
  if (situacao === 'Ativo') return 'Solução de antivírus ativa e atualizada, protegendo o equipamento contra ameaças conhecidas.';
  if (situacao === 'Expirado') return 'Solução de antivírus presente, porém com licença expirada — proteção comprometida.';
  if (situacao === 'Sem') return 'Equipamento sem solução de antivírus instalada, configurando vulnerabilidade crítica de segurança.';
  return '';
}

export function narrateEstadoVisual(label: string, valor: string): string {
  if (!valor) return '';
  const map: Record<string, string> = {
    Ótimo: 'em estado ótimo, sem qualquer ressalva',
    Bom: 'em bom estado, atendendo plenamente às necessidades operacionais',
    Regular: 'em estado regular, dentro do esperado para o tempo de uso',
    Ruim: 'em estado ruim, demandando atenção e ações corretivas',
    Péssimo: 'em estado péssimo, recomendando-se substituição imediata',
    Adequada: 'adequada e em conformidade',
    'Com ressalvas': 'com ressalvas pontuais que devem ser revistas',
    Vulnerável: 'em condição vulnerável, exigindo reforço imediato',
    Comprometida: 'comprometida, configurando risco crítico',
    Funcional: 'plenamente funcional',
    Instável: 'apresentando instabilidades recorrentes',
    'Sem acesso à rede': 'sem acesso à rede no momento da avaliação',
    'N/A': 'não avaliado / não se aplica',
  };
  return `${label}: ${map[valor] || valor}.`;
}

export function narrateParecer(parecer: string): string {
  switch (parecer) {
    case 'ADEQUADO':
      return 'Após análise técnica detalhada, o equipamento foi considerado ADEQUADO PARA USO, atendendo aos requisitos operacionais da finalidade declarada.';
    case 'ADEQUADO_RESSALVAS':
      return 'Após análise técnica, o equipamento foi considerado ADEQUADO PARA USO COM RESSALVAS, devendo ser observadas as recomendações descritas neste laudo.';
    case 'INADEQUADO':
      return 'Após análise técnica detalhada, o equipamento foi considerado INADEQUADO PARA USO, sendo necessária intervenção corretiva antes do retorno à operação.';
    case 'CONDENADO':
      return 'Após análise técnica conclusiva, o equipamento foi considerado CONDENADO, sendo tecnicamente inviável ou economicamente desfavorável a continuidade do uso.';
    default:
      return '';
  }
}

export function narrateCriticidade(c: string): string {
  if (c === 'Alta') return 'CRÍTICA — exige tratamento imediato';
  if (c === 'Média') return 'MODERADA — recomenda-se ação programada';
  if (c === 'Baixa') return 'BAIXA — pode ser tratada em manutenção rotineira';
  return c;
}
