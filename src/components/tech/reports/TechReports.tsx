import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, Monitor } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ReportGenerator from './ReportGenerator';
import AdvancedReportGenerator from './AdvancedReportGenerator';
import ReportList from './ReportList';

type View = 'list' | 'choose' | 'atendimento' | 'equipamento';

const TechReports: React.FC = () => {
  const [view, setView] = useState<View>('list');

  const titles: Record<View, { t: string; s: string }> = {
    list: { t: 'Laudos Técnicos', s: 'Histórico de laudos gerados.' },
    choose: { t: 'Novo Laudo', s: 'Selecione o tipo de laudo a emitir.' },
    atendimento: { t: 'Laudo de Atendimento', s: 'Preencha o checklist e gere o documento em PDF.' },
    equipamento: { t: 'Laudo de Equipamento', s: 'Inspeção completa de hardware, software e parecer técnico.' },
  };

  const current = titles[view];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{current.t}</h3>
          <p className="text-sm text-gray-500">{current.s}</p>
        </div>
        {view === 'list' ? (
          <Button onClick={() => setView('choose')} className="bg-blue-900 hover:bg-blue-800">
            + Novo Laudo
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setView(view === 'choose' ? 'list' : 'choose')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        )}
      </div>

      {view === 'list' && <ReportList />}

      {view === 'choose' && (
        <div className="grid sm:grid-cols-2 gap-4">
          <Card className="cursor-pointer hover:border-blue-900 transition-colors" onClick={() => setView('atendimento')}>
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <FileText className="w-12 h-12 text-blue-900" />
              <h4 className="font-semibold text-gray-900">Laudo de Atendimento</h4>
              <p className="text-sm text-gray-500">
                Modelo simples e rápido — triagem, diagnóstico e conclusão para chamados pontuais.
              </p>
            </CardContent>
          </Card>
          <Card className="cursor-pointer hover:border-blue-900 transition-colors" onClick={() => setView('equipamento')}>
            <CardContent className="p-6 flex flex-col items-center text-center gap-3">
              <Monitor className="w-12 h-12 text-blue-900" />
              <h4 className="font-semibold text-gray-900">Laudo de Equipamento</h4>
              <p className="text-sm text-gray-500">
                Modelo completo Delta7 — inspeção de hardware, software, parecer e assinaturas digitais.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {view === 'atendimento' && <ReportGenerator onSaved={() => setView('list')} />}
      {view === 'equipamento' && <AdvancedReportGenerator onSaved={() => setView('list')} />}
    </div>
  );
};

export default TechReports;
