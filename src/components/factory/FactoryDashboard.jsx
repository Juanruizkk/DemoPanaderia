import React, { useState } from 'react';
import { FactoryLoadsView } from './FactoryLoadsView';
import { TrayPlanner } from './TrayPlanner';
import { Factory, Layers } from 'lucide-react';

export const FactoryDashboard = () => {
  const [activeTab, setActiveTab] = useState('loads'); // 'loads', 'planner'

  return (
    <div className="space-y-6">
      {/* Subtab navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('loads')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'loads'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
          }`}
        >
          <Factory className="w-4 h-4" />
          <span>Planilla de Carga & Descarga (calle.jpg)</span>
        </button>

        <button
          onClick={() => setActiveTab('planner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'planner'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Relleno de Bandejas (Día Siguiente)</span>
        </button>
      </div>

      <div className="pt-2">
        {activeTab === 'loads' && <FactoryLoadsView />}
        {activeTab === 'planner' && <TrayPlanner />}
      </div>
    </div>
  );
};
