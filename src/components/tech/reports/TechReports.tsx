import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ArrowLeft } from 'lucide-react';
import ReportGenerator from './ReportGenerator';
import ReportList from './ReportList';

const TechReports: React.FC = () => {
  const [view, setView] = useState<'list' | 'new'>('list');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {view === 'list' ? 'Laudos Técnicos' : 'Novo Laudo'}
          </h3>
          <p className="text-sm text-gray-500">
            {view === 'list'
              ? 'Histórico de laudos gerados.'
              : 'Preencha o checklist e gere o documento em PDF.'}
          </p>
        </div>
        {view === 'list' ? (
          <Button onClick={() => setView('new')} className="bg-blue-900 hover:bg-blue-800">
            <Plus className="w-4 h-4 mr-2" /> Novo Laudo
          </Button>
        ) : (
          <Button variant="outline" onClick={() => setView('list')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        )}
      </div>

      {view === 'list' ? <ReportList /> : <ReportGenerator onSaved={() => setView('list')} />}
    </div>
  );
};

export default TechReports;
