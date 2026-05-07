import React from 'react';
import ItSupportProposals from '@/components/tech/it-support/ItSupportProposals';

const AdminItSupportProposals: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Propostas Suporte TI</h2>
      <p className="text-gray-500">Contratos mensais de suporte técnico — geração rápida com modelo Premium ou Editorial.</p>
    </div>
    <ItSupportProposals />
  </div>
);

export default AdminItSupportProposals;
