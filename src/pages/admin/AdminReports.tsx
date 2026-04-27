import React from 'react';
import TechReports from '@/components/tech/reports/TechReports';

const AdminReports: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Laudos Técnicos</h2>
        <p className="text-gray-500">Visualize, edite e gere laudos de qualquer técnico.</p>
      </div>
      <TechReports />
    </div>
  );
};

export default AdminReports;
