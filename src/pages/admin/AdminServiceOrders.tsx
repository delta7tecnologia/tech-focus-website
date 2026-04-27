import React from 'react';
import ServiceOrders from '@/components/tech/service-orders/ServiceOrders';

const AdminServiceOrders: React.FC = () => (
  <div className="space-y-6">
    <div>
      <h2 className="text-2xl font-bold text-gray-900">Ordens de Serviço</h2>
      <p className="text-gray-500">Visitas técnicas externas — controle, evidências e assinaturas.</p>
    </div>
    <ServiceOrders />
  </div>
);

export default AdminServiceOrders;
