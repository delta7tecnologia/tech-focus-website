import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import ServiceOrderForm from './ServiceOrderForm';
import ServiceOrderList from './ServiceOrderList';

const ServiceOrders: React.FC = () => {
  const [view, setView] = useState<'list' | 'edit'>('list');
  const [draft, setDraft] = useState<any>(null);

  const goList = () => { setView('list'); setDraft(null); };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {view === 'list' ? 'Ordens de Serviço' : (draft ? `Editando ${draft.os_number}` : 'Nova Ordem de Serviço')}
          </h3>
          <p className="text-sm text-gray-500">
            {view === 'list' ? 'Visitas técnicas externas com check-in geolocalizado, evidências e assinatura.' : 'Preencha os dados da visita e finalize com a assinatura.'}
          </p>
        </div>
        {view === 'list' ? (
          <Button onClick={() => { setDraft(null); setView('edit'); }} className="bg-blue-900 hover:bg-blue-800">+ Nova OS</Button>
        ) : (
          <Button variant="outline" onClick={goList}><ArrowLeft className="w-4 h-4 mr-2" /> Voltar</Button>
        )}
      </div>

      {view === 'list' && <ServiceOrderList onEdit={(os) => { setDraft(os); setView('edit'); }} />}
      {view === 'edit' && <ServiceOrderForm draft={draft} onSaved={goList} />}
    </div>
  );
};

export default ServiceOrders;
