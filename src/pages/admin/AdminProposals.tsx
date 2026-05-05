import React from 'react';
import CommercialProposals from '@/components/tech/proposals/CommercialProposals';

const AdminProposals: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Propostas Comerciais</h2>
      <p className="text-gray-500">Backup Online — geração rápida de propostas para clientes.</p>
    </div>
    <CommercialProposals />
  </div>
);

export default AdminProposals;
