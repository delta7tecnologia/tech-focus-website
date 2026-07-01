import React from 'react';
import { useNavigate } from 'react-router-dom';
import VmProposalForm from '@/components/proposals/VmProposalForm';

const PropostaVm: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="text-2xl font-bold text-blue-900 mb-6">Nova Proposta — Locação de VMs</h1>
        <VmProposalForm onClose={() => navigate(-1)} />
      </div>
    </div>
  );
};

export default PropostaVm;
