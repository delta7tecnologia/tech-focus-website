import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, Eye, Save, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface ChecklistItem {
  label: string;
  ok: boolean;
  required: boolean;
  hint?: string;
}

interface Props {
  items: ChecklistItem[];
  isLocked: boolean;
  isGenerating: boolean;
  isSavingDraft: boolean;
  canFinalize: boolean;
  onSaveDraft: () => void;
  onFinalize: () => void;
  reportNumber?: string;
}

export const ReportFinalizationPanel: React.FC<Props> = ({
  items, isLocked, isGenerating, isSavingDraft, canFinalize,
  onSaveDraft, onFinalize, reportNumber,
}) => {
  const requiredItems = items.filter((i) => i.required);
  const completedRequired = requiredItems.filter((i) => i.ok).length;
  const totalRequired = requiredItems.length;
  const allRequiredOk = completedRequired === totalRequired;

  return (
    <div className="rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50/40 to-white p-5 space-y-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h4 className="text-base font-bold text-blue-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            Checklist de finalização
          </h4>
          <p className="text-xs text-gray-600 mt-1">
            Confirme os itens obrigatórios antes de gerar o documento oficial.
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-900">
            {completedRequired}/{totalRequired}
          </div>
          <div className="text-xs text-gray-500">obrigatórios prontos</div>
        </div>
      </div>

      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className={`flex items-start gap-2 rounded-md border p-2.5 text-sm transition-colors ${
              item.ok
                ? 'border-green-200 bg-green-50/60 text-green-900'
                : item.required
                  ? 'border-amber-200 bg-amber-50/60 text-amber-900'
                  : 'border-gray-200 bg-gray-50 text-gray-600'
            }`}
          >
            {item.ok ? (
              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
            ) : (
              <AlertCircle className={`w-4 h-4 mt-0.5 shrink-0 ${item.required ? 'text-amber-600' : 'text-gray-400'}`} />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium">{item.label}</span>
                {!item.required && (
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-gray-200 text-gray-600">
                    Opcional
                  </span>
                )}
              </div>
              {item.hint && !item.ok && (
                <p className="text-xs mt-0.5 opacity-80">{item.hint}</p>
              )}
            </div>
          </li>
        ))}
      </ul>

      {!allRequiredOk && !isLocked && (
        <div className="rounded-md bg-amber-100 border border-amber-300 p-3 text-xs text-amber-900">
          ⚠ Conclua os itens obrigatórios destacados acima para liberar a emissão do laudo final.
        </div>
      )}

      {isLocked && (
        <div className="rounded-md bg-amber-50 border border-amber-300 p-3 text-xs text-amber-900 flex items-center gap-2">
          <Lock className="w-4 h-4" />
          Laudo {reportNumber} já foi emitido. Ações disponíveis: salvar novas assinaturas e regenerar PDF para visualização.
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:justify-end pt-2 border-t border-blue-100">
        <Button
          type="button"
          variant="outline"
          onClick={onSaveDraft}
          disabled={isSavingDraft || isGenerating}
        >
          {isSavingDraft ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvando...</>
          ) : (
            <><Save className="w-4 h-4 mr-2" /> {isLocked ? 'Salvar assinaturas' : 'Salvar rascunho'}</>
          )}
        </Button>
        <Button
          type="button"
          className="bg-blue-900 hover:bg-blue-800"
          onClick={onFinalize}
          disabled={isGenerating || isSavingDraft || (!canFinalize && !isLocked)}
        >
          {isGenerating ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Gerando...</>
          ) : (
            <><Eye className="w-4 h-4 mr-2" /> {isLocked ? 'Visualizar PDF' : 'Pré-visualizar e emitir laudo'}</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReportFinalizationPanel;
