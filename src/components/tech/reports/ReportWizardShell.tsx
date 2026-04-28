import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, Circle, ChevronLeft, ChevronRight,
  ClipboardList, Cpu, Stethoscope, Camera, FileSignature,
  Lock, ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WizardStep {
  id: number;
  title: string;
  shortTitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  /** Quais seções (1..9) do laudo este passo agrupa */
  sections: number[];
  /** Função opcional para validar conclusão deste passo */
  isComplete?: () => boolean;
}

export const REPORT_STEPS: WizardStep[] = [
  {
    id: 1, title: 'Identificação', shortTitle: 'Identificação',
    icon: ClipboardList,
    description: 'Cliente, equipamento e técnico responsável.',
    sections: [1],
  },
  {
    id: 2, title: 'Inspeção Técnica', shortTitle: 'Inspeção',
    icon: Cpu,
    description: 'Hardware, software e estado geral.',
    sections: [2, 3, 5],
  },
  {
    id: 3, title: 'Diagnóstico', shortTitle: 'Diagnóstico',
    icon: Stethoscope,
    description: 'Problemas, parecer e recomendações.',
    sections: [4, 6, 7],
  },
  {
    id: 4, title: 'Evidências', shortTitle: 'Evidências',
    icon: Camera,
    description: 'Fotos e documentos comprobatórios.',
    sections: [8],
  },
  {
    id: 5, title: 'Finalização', shortTitle: 'Finalização',
    icon: FileSignature,
    description: 'Assinaturas, validações e emissão.',
    sections: [9],
  },
];

interface Props {
  currentStep: number;
  onStepChange: (step: number) => void;
  isLocked: boolean;
  documentVersion: number;
  reportNumber?: string;
  autoSaveStatus?: 'idle' | 'saving' | 'saved' | 'error';
  lastSavedAt?: Date | null;
  children: React.ReactNode;
  /** Bloco de checklist + ações que aparece SEMPRE no rodapé do step 5 */
  finalizationPanel?: React.ReactNode;
  /** Botões de navegação extras (ex: Salvar rascunho) */
  bottomActions?: React.ReactNode;
}

export const ReportWizardShell: React.FC<Props> = ({
  currentStep, onStepChange, isLocked, documentVersion, reportNumber,
  autoSaveStatus, lastSavedAt, children, finalizationPanel, bottomActions,
}) => {
  const total = REPORT_STEPS.length;
  const progressPct = Math.round((currentStep / total) * 100);
  const step = REPORT_STEPS[currentStep - 1];
  const Icon = step.icon;

  const goPrev = () => onStepChange(Math.max(1, currentStep - 1));
  const goNext = () => onStepChange(Math.min(total, currentStep + 1));

  return (
    <div className="space-y-5">
      {/* Banner de bloqueio (laudo emitido) */}
      {isLocked && (
        <div className="rounded-lg border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-orange-50 p-4 flex items-start gap-3">
          <Lock className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-bold text-amber-900">
              Documento emitido — versão v{documentVersion}
            </p>
            <p className="text-xs text-amber-800 mt-0.5">
              {reportNumber ? `Laudo ${reportNumber}. ` : ''}
              Os dados estão protegidos contra alteração. Você ainda pode coletar assinaturas pendentes na etapa <strong>Finalização</strong>.
              Cada nova assinatura é registrada no histórico de auditoria com hash SHA-256.
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
        </div>
      )}

      {/* Stepper visual */}
      <div className="rounded-lg border bg-white p-4 sm:p-5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-900 text-white">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500 leading-none">Etapa {currentStep} de {total}</p>
              <h3 className="text-base font-bold text-blue-900 leading-tight">{step.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {autoSaveStatus && (
              <div className="hidden sm:flex items-center gap-1.5 text-xs">
                {autoSaveStatus === 'saving' && (
                  <span className="text-blue-600 font-medium animate-pulse">● Salvando...</span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-green-700 font-medium">
                    ✓ Salvo {lastSavedAt ? lastSavedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                )}
                {autoSaveStatus === 'error' && (
                  <span className="text-red-600 font-medium">⚠ Falha ao salvar</span>
                )}
                {autoSaveStatus === 'idle' && (
                  <span className="text-gray-400">Auto-save ativo</span>
                )}
              </div>
            )}
            <span className="text-xs font-semibold text-gray-700">{progressPct}%</span>
          </div>
        </div>
        <Progress value={progressPct} className="h-2" />
        <p className="text-xs text-gray-500 mt-2">{step.description}</p>

        {/* Tabs/Pills de etapas (clicáveis) */}
        <div className="grid grid-cols-5 gap-1.5 mt-4">
          {REPORT_STEPS.map((st) => {
            const StIcon = st.icon;
            const isCurrent = st.id === currentStep;
            const isDone = st.id < currentStep;
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onStepChange(st.id)}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-md border px-1 py-2 text-[10px] sm:text-xs font-medium transition-all',
                  isCurrent && 'border-blue-900 bg-blue-50 text-blue-900 shadow-sm scale-[1.02]',
                  !isCurrent && isDone && 'border-green-300 bg-green-50 text-green-800 hover:bg-green-100',
                  !isCurrent && !isDone && 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100',
                )}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : isCurrent ? (
                  <StIcon className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{st.shortTitle}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conteúdo (sections do laudo serão filtrados via CSS pelo pai) */}
      <div>{children}</div>

      {/* Painel de finalização (somente etapa 5) */}
      {currentStep === total && finalizationPanel}

      {/* Barra inferior de navegação (sticky no mobile) */}
      <div className="sticky bottom-2 z-20 mt-6">
        <div className="rounded-lg border bg-white shadow-lg p-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={goPrev}
            disabled={currentStep === 1}
            className="sm:w-auto"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
          </Button>

          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            {bottomActions}
            {currentStep < total && (
              <Button
                type="button"
                onClick={goNext}
                className="bg-blue-900 hover:bg-blue-800"
              >
                Próxima etapa <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportWizardShell;
