import jsPDF from 'jspdf';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';
import { escapeHtml } from './reportNarrative';
import { DELTA7_LOGO_DATA_URL } from '@/assets/delta7LogoBase64';
import {
  narrateHardware,
  narrateSO,
  narrateOffice,
  narrateAntivirus,
  narrateEstadoVisual,
  narrateParecer,
  narrateCriticidade,
  type SituacaoHW,
} from './reportNarrativeAdvanced';

export interface AdvancedPhoto {
  dataUrl: string;
  caption: string;
  external?: boolean;
  externalUrl?: string;
  externalProvider?: string;
}

export interface AdvancedReportData {
  reportNumber: string;
  generatedAt: string;
  technicianName: string;
  // Identificação
  patrimonio: string;
  marca: string;
  modelo: string;
  tipo: string; // Desktop / Notebook
  setor: string;
  unidade: string;
  usuario: string;
  contato: string;
  dataAquisicao: string;
  garantia: string; // Sim/Não/N/A
  finalidades: string[];
  finalidadeOutro: string;
  // Hardware
  hardware: Array<{ componente: string; descricao: string; situacao: SituacaoHW; obs?: string }>;
  // Software
  software: {
    so: { descricao: string; situacao: string; obs: string };
    office: { descricao: string; situacao: string; obs: string };
    antivirus: { descricao: string; situacao: string; obs: string };
    especifico: { descricao: string; situacao: string; obs: string };
    drivers: { descricao: string; situacao: string; obs: string };
  };
  // Diagnóstico
  problemas: Array<{ area: string; descricao: string; criticidade: string; acao: string }>;
  // Estado geral
  estado: {
    conservacao: string;
    desempenho: string;
    seguranca: string;
    conectividade: string;
  };
  // Parecer
  parecer: string; // ADEQUADO / ADEQUADO_RESSALVAS / INADEQUADO / CONDENADO
  parecerTexto: string;
  // Recomendações
  recomendacoes: Array<{ texto: string; responsavel: string; prazo: string }>;
  // Fotos
  photos: AdvancedPhoto[];
  observacoesFinais: string;
  // Assinaturas
  assinaturaTecnico: string;
  assinaturaGestor: string;
  assinaturaUsuario: string;
  gestorNome: string;
  gestorCargo: string;
  usuarioNome: string;
  usuarioMatricula: string;
  // Hash
  integrityHash: string;
}

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

const fmtDate = (iso: string) => {
  if (!iso) return '___/___/______';
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR');
  } catch { return iso; }
};

const sectionTitle = (n: string, t: string) => `
  <div style="font-size: 13px; font-weight: 800; color: #ffffff; background: #1e3a8a; padding: 6px 12px; margin: 18px 0 10px; border-radius: 3px; letter-spacing: 0.5px;">
    ${n}. ${t}
  </div>`;

function buildHtml(r: AdvancedReportData): string {
  // Hardware narrativa + tabela
  const hwRows = r.hardware
    .filter((h) => h.descricao || h.situacao)
    .map(
      (h) => `
        <tr>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-weight: 600;">${escapeHtml(h.componente)}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(h.descricao || '—')}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700; color: ${h.situacao === 'Bom' ? '#16a34a' : h.situacao === 'Regular' ? '#d97706' : h.situacao === 'Ruim' ? '#dc2626' : '#64748b'};">${escapeHtml(h.situacao || '—')}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10px; color: #475569;">${escapeHtml(h.obs || '')}</td>
        </tr>`
    )
    .join('');

  const hwNarrative = r.hardware
    .filter((h) => h.situacao && h.situacao !== 'Bom')
    .map((h) => `<li style="margin-bottom: 4px;">${escapeHtml(narrateHardware(h.componente, h.situacao))}</li>`)
    .join('');

  // Software
  const swRow = (label: string, item: { descricao: string; situacao: string; obs: string }) => `
    <tr>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-weight: 600;">${label}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(item.descricao || '—')}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${escapeHtml(item.situacao || '—')}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; font-size: 10px; color: #475569;">${escapeHtml(item.obs || '')}</td>
    </tr>`;

  const swNarrative = [
    narrateSO(r.software.so.situacao),
    narrateOffice(r.software.office.situacao),
    narrateAntivirus(r.software.antivirus.situacao),
  ].filter(Boolean).map((s) => `<li style="margin-bottom: 4px;">${escapeHtml(s)}</li>`).join('');

  // Problemas
  const problemRows = r.problemas
    .filter((p) => p.descricao)
    .map(
      (p, i) => `
        <tr>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center;">${i + 1}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(p.area)}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(p.descricao)}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700; color: ${p.criticidade === 'Alta' ? '#dc2626' : p.criticidade === 'Média' ? '#d97706' : '#16a34a'};">${escapeHtml(narrateCriticidade(p.criticidade))}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(p.acao)}</td>
        </tr>`
    )
    .join('');

  // Recomendações
  const recRows = r.recomendacoes
    .filter((p) => p.texto)
    .map(
      (p, i) => `
        <tr>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center;">${i + 1}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(p.texto)}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(p.responsavel || '—')}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1; text-align: center;">${fmtDate(p.prazo)}</td>
        </tr>`
    )
    .join('');

  // Photos
  const photos = r.photos
    .map((p) => {
      if (p.external) {
        return `
        <div style="break-inside: avoid; page-break-inside: avoid; width: 48%; margin-bottom: 14px;">
          <div style="width: 100%; height: 170px; border: 1px dashed #94a3b8; border-radius: 4px; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 12px; background: #f1f5f9; box-sizing: border-box;">
            <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">📎 Anexo externo</div>
            <div style="font-size: 11px; color: #1e3a8a; margin-top: 6px; font-weight: 600;">${escapeHtml(p.externalProvider || 'Link externo')}</div>
            <div style="font-size: 9px; color: #64748b; margin-top: 6px; word-break: break-all; text-align: center; max-width: 100%;">${escapeHtml(p.externalUrl || '')}</div>
          </div>
          <div style="font-size: 10px; color: #475569; margin-top: 4px; text-align: center; font-style: italic;">
            ${escapeHtml(p.caption || 'Sem legenda')}
          </div>
        </div>`;
      }
      return `
        <div style="break-inside: avoid; page-break-inside: avoid; width: 48%; margin-bottom: 14px;">
          <img src="${p.dataUrl}" style="width: 100%; height: 170px; object-fit: cover; border: 1px solid #cbd5e1; border-radius: 4px;" />
          <div style="font-size: 10px; color: #475569; margin-top: 4px; text-align: center; font-style: italic;">
            ${escapeHtml(p.caption || 'Sem legenda')}
          </div>
        </div>`;
    })
    .join('');

  const finalidades = [
    ...r.finalidades,
    r.finalidadeOutro ? `Outro: ${r.finalidadeOutro}` : '',
  ].filter(Boolean).join(' · ') || '—';

  const parecerColor =
    r.parecer === 'ADEQUADO' ? '#16a34a' :
    r.parecer === 'ADEQUADO_RESSALVAS' ? '#d97706' :
    r.parecer === 'INADEQUADO' ? '#dc2626' :
    r.parecer === 'CONDENADO' ? '#7f1d1d' : '#64748b';

  const parecerLabel =
    r.parecer === 'ADEQUADO' ? 'ADEQUADO PARA USO' :
    r.parecer === 'ADEQUADO_RESSALVAS' ? 'ADEQUADO COM RESSALVAS' :
    r.parecer === 'INADEQUADO' ? 'INADEQUADO PARA USO' :
    r.parecer === 'CONDENADO' ? 'CONDENADO' : '—';

  return `
<div style="width: 794px; padding: 36px 44px; font-family: 'Helvetica', Arial, sans-serif; color: #1e293b; background: white; box-sizing: border-box; font-size: 11px;">
  <!-- Cabeçalho timbrado Delta7 -->
  <div style="border-bottom: 4px solid #1e3a8a; padding-bottom: 14px; margin-bottom: 18px;">
    <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 14px;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <img src="${DELTA7_LOGO_DATA_URL}" alt="Delta7" style="height: 54px; width: auto; display: block;" />
        <div>
          <div style="font-size: 17px; font-weight: 800; color: #1e3a8a; letter-spacing: 0.5px;">
            DELTA7 SOLUÇÕES EM TECNOLOGIA
          </div>
          <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
            LAUDO TÉCNICO DE EQUIPAMENTO — Computador / Estação de Trabalho
          </div>
        </div>
      </div>
      <div style="text-align: right; font-size: 11px;">
        <div style="font-weight: 700; color: #1e3a8a; font-size: 13px;">Nº ${escapeHtml(r.reportNumber)}</div>
        <div style="color: #64748b; margin-top: 2px;">${fmtDateTime(r.generatedAt)}</div>
      </div>
    </div>
  </div>

  ${sectionTitle('1', 'IDENTIFICAÇÃO DO EQUIPAMENTO')}
  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <tr>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600; width: 22%;">Patrimônio / Nº de Série</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; width: 28%;">${escapeHtml(r.patrimonio || '—')}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600; width: 22%;">Marca</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; width: 28%;">${escapeHtml(r.marca || '—')}</td>
    </tr>
    <tr>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Modelo</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.modelo || '—')}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Tipo</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.tipo || '—')}</td>
    </tr>
    <tr>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Setor / Departamento</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.setor || '—')}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Unidade</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.unidade || '—')}</td>
    </tr>
    <tr>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Usuário Responsável</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.usuario || '—')}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Ramal / Contato</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.contato || '—')}</td>
    </tr>
    <tr>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Data de Aquisição</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${fmtDate(r.dataAquisicao)}</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1; background: #f1f5f9; font-weight: 600;">Garantia vigente?</td>
      <td style="padding: 5px 8px; border: 1px solid #cbd5e1;">${escapeHtml(r.garantia || '—')}</td>
    </tr>
  </table>

  ${sectionTitle('2', 'FINALIDADE PRINCIPAL DO EQUIPAMENTO')}
  <p style="margin: 0; padding: 8px 12px; background: #f8fafc; border-left: 3px solid #1e3a8a; font-size: 11px;">
    ${escapeHtml(finalidades)}
  </p>

  ${sectionTitle('3', 'INSPEÇÃO DE HARDWARE')}
  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <thead>
      <tr style="background: #1e3a8a; color: white;">
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Componente</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Descrição</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: center; width: 80px;">Situação</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Observações</th>
      </tr>
    </thead>
    <tbody>${hwRows || '<tr><td colspan="4" style="padding: 8px; border: 1px solid #cbd5e1; color: #94a3b8; text-align: center;">Sem componentes informados.</td></tr>'}</tbody>
  </table>
  ${hwNarrative ? `<div style="margin-top: 8px; font-size: 11px; color: #334155;"><strong>Análise narrativa:</strong><ul style="margin: 4px 0 0 18px; padding: 0;">${hwNarrative}</ul></div>` : ''}

  ${sectionTitle('4', 'CONFIGURAÇÃO DE SOFTWARE')}
  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <thead>
      <tr style="background: #1e3a8a; color: white;">
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Item</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Descrição / Versão</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: center; width: 100px;">Situação</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Observação</th>
      </tr>
    </thead>
    <tbody>
      ${swRow('Sistema Operacional', r.software.so)}
      ${swRow('Pacote Office / Produtividade', r.software.office)}
      ${swRow('Antivírus / Segurança', r.software.antivirus)}
      ${swRow('Software Específico', r.software.especifico)}
      ${swRow('Drivers / Atualizações', r.software.drivers)}
    </tbody>
  </table>
  ${swNarrative ? `<div style="margin-top: 8px; font-size: 11px; color: #334155;"><strong>Compliance:</strong><ul style="margin: 4px 0 0 18px; padding: 0;">${swNarrative}</ul></div>` : ''}

  ${sectionTitle('5', 'DIAGNÓSTICO DE PROBLEMAS IDENTIFICADOS')}
  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <thead>
      <tr style="background: #1e3a8a; color: white;">
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; width: 30px;">Nº</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Componente / Área</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Descrição do Problema</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: center; width: 130px;">Criticidade</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Ação Recomendada</th>
      </tr>
    </thead>
    <tbody>${problemRows || '<tr><td colspan="5" style="padding: 8px; border: 1px solid #cbd5e1; color: #94a3b8; text-align: center;">Nenhum problema identificado.</td></tr>'}</tbody>
  </table>

  ${sectionTitle('6', 'ESTADO GERAL DO EQUIPAMENTO')}
  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <thead>
      <tr style="background: #f1f5f9;">
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Conservação</th>
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Desempenho</th>
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Segurança</th>
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Conectividade</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${escapeHtml(r.estado.conservacao || '—')}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${escapeHtml(r.estado.desempenho || '—')}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${escapeHtml(r.estado.seguranca || '—')}</td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: 700;">${escapeHtml(r.estado.conectividade || '—')}</td>
      </tr>
    </tbody>
  </table>
  <ul style="margin: 8px 0 0 18px; padding: 0; font-size: 11px; color: #334155;">
    ${[
      narrateEstadoVisual('Conservação Física', r.estado.conservacao),
      narrateEstadoVisual('Desempenho Operacional', r.estado.desempenho),
      narrateEstadoVisual('Segurança da Informação', r.estado.seguranca),
      narrateEstadoVisual('Conectividade / Rede', r.estado.conectividade),
    ].filter(Boolean).map((s) => `<li>${escapeHtml(s)}</li>`).join('')}
  </ul>

  ${sectionTitle('7', 'PARECER CONCLUSIVO')}
  <div style="text-align: center; margin-bottom: 10px;">
    <span style="display: inline-block; padding: 8px 20px; background: ${parecerColor}; color: white; font-weight: 800; border-radius: 4px; font-size: 13px; letter-spacing: 0.5px;">
      ${parecerLabel}
    </span>
  </div>
  <p style="font-size: 11px; line-height: 1.6; text-align: justify; color: #334155; margin: 8px 0;">
    ${escapeHtml(narrateParecer(r.parecer))}
  </p>
  ${r.parecerTexto ? `<div style="border-left: 3px solid #1e3a8a; padding: 8px 12px; background: #f8fafc; font-size: 11px; line-height: 1.6;"><strong>Justificativa Técnica:</strong><br/>${escapeHtml(r.parecerTexto)}</div>` : ''}

  ${sectionTitle('8', 'RECOMENDAÇÕES E PROVIDÊNCIAS')}
  <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
    <thead>
      <tr style="background: #1e3a8a; color: white;">
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; width: 30px;">Nº</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left;">Providência / Recomendação</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: left; width: 25%;">Responsável</th>
        <th style="padding: 6px 8px; border: 1px solid #1e3a8a; text-align: center; width: 110px;">Prazo Estimado</th>
      </tr>
    </thead>
    <tbody>${recRows || '<tr><td colspan="4" style="padding: 8px; border: 1px solid #cbd5e1; color: #94a3b8; text-align: center;">Nenhuma providência registrada.</td></tr>'}</tbody>
  </table>

  ${r.photos.length > 0 ? `
    ${sectionTitle('9', 'EVIDÊNCIAS FOTOGRÁFICAS')}
    <div style="display: flex; flex-wrap: wrap; gap: 4%;">${photos}</div>
  ` : ''}

  ${sectionTitle(r.photos.length > 0 ? '10' : '9', 'ASSINATURAS E RESPONSABILIDADES')}
  <table style="width: 100%; border-collapse: collapse; font-size: 10px;">
    <thead>
      <tr style="background: #f1f5f9;">
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Técnico Responsável</th>
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Gestor / Supervisor</th>
        <th style="padding: 6px 8px; border: 1px solid #cbd5e1; text-align: center;">Usuário do Equipamento</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 8px; border: 1px solid #cbd5e1; vertical-align: top; text-align: center;">
          <div style="height: 60px; display: flex; align-items: center; justify-content: center;">
            ${r.assinaturaTecnico ? `<img src="${r.assinaturaTecnico}" style="max-height: 60px; max-width: 100%;" />` : '<span style="color: #94a3b8; font-style: italic;">— sem assinatura —</span>'}
          </div>
          <div style="border-top: 1px solid #1e293b; margin-top: 4px; padding-top: 4px; text-align: left;">
            <div><strong>Nome:</strong> ${escapeHtml(r.technicianName)}</div>
            <div><strong>Data:</strong> ${fmtDate(r.generatedAt)}</div>
          </div>
        </td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; vertical-align: top; text-align: center;">
          <div style="height: 60px; display: flex; align-items: center; justify-content: center;">
            ${r.assinaturaGestor ? `<img src="${r.assinaturaGestor}" style="max-height: 60px; max-width: 100%;" />` : '<span style="color: #94a3b8; font-style: italic;">— sem assinatura —</span>'}
          </div>
          <div style="border-top: 1px solid #1e293b; margin-top: 4px; padding-top: 4px; text-align: left;">
            <div><strong>Nome:</strong> ${escapeHtml(r.gestorNome || '—')}</div>
            <div><strong>Cargo:</strong> ${escapeHtml(r.gestorCargo || '—')}</div>
          </div>
        </td>
        <td style="padding: 8px; border: 1px solid #cbd5e1; vertical-align: top; text-align: center;">
          <div style="height: 60px; display: flex; align-items: center; justify-content: center;">
            ${r.assinaturaUsuario ? `<img src="${r.assinaturaUsuario}" style="max-height: 60px; max-width: 100%;" />` : '<span style="color: #94a3b8; font-style: italic;">— sem assinatura —</span>'}
          </div>
          <div style="border-top: 1px solid #1e293b; margin-top: 4px; padding-top: 4px; text-align: left;">
            <div><strong>Nome:</strong> ${escapeHtml(r.usuarioNome || r.usuario || '—')}</div>
            <div><strong>Matrícula:</strong> ${escapeHtml(r.usuarioMatricula || '—')}</div>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  ${r.observacoesFinais ? `
    <div style="margin-top: 16px;">
      <div style="font-weight: 700; color: #1e3a8a; font-size: 11px; margin-bottom: 4px;">OBSERVAÇÕES FINAIS / INFORMAÇÕES COMPLEMENTARES</div>
      <div style="font-size: 11px; line-height: 1.6; color: #334155; padding: 8px 12px; background: #f8fafc; border-left: 3px solid #1e3a8a;">
        ${escapeHtml(r.observacoesFinais)}
      </div>
    </div>
  ` : ''}

  <!-- Rodapé com hash -->
  <div style="margin-top: 24px; padding-top: 12px; border-top: 2px solid #1e3a8a;">
    <div style="font-size: 9px; color: #64748b; margin-bottom: 4px;">
      <strong>Hash de Legitimidade SHA-256:</strong>
    </div>
    <div style="font-family: 'Courier New', monospace; font-size: 9px; color: #1e3a8a; word-break: break-all; background: #f1f5f9; padding: 6px; border-radius: 3px;">
      ${escapeHtml(r.integrityHash)}
    </div>
    <div style="font-size: 9px; color: #94a3b8; text-align: center; margin-top: 8px; font-style: italic;">
      Documento gerado eletronicamente pela plataforma Delta7 — integridade garantida pelo hash de segurança acima.
    </div>
  </div>
</div>`;
}

export async function generateAdvancedReportPdf(report: AdvancedReportData): Promise<jsPDF> {
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.innerHTML = buildHtml(report);
  document.body.appendChild(container);

  try {
    const target = container.firstElementChild as HTMLElement;
    const canvas = await html2canvas(target, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    const imgData = canvas.toDataURL('image/jpeg', 0.92);
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    return pdf;
  } finally {
    document.body.removeChild(container);
  }
}

export async function downloadAdvancedReportPdf(r: AdvancedReportData): Promise<void> {
  const pdf = await generateAdvancedReportPdf(r);
  pdf.save(`${r.reportNumber}.pdf`);
}
